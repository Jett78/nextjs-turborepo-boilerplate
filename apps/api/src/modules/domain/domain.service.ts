import { Injectable, NotFoundException, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DB_CONNECTION } from '../../db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { CreateDomainDto } from './dto/create-domain.dto';
import { DnsVerificationService } from './dns-verification.service';

interface DokployDomainResponse {
  domainId: string;
  host: string;
  https: boolean;
  certificateType: string;
}

@Injectable()
export class DomainService {
  private readonly logger = new Logger(DomainService.name);
  private readonly dokployApiUrl: string;
  private readonly dokployApiKey: string;
  private readonly dokployApplicationId: string;

  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly dnsVerificationService: DnsVerificationService,
    private readonly configService: ConfigService,
  ) {
    this.dokployApiUrl = this.configService.get<string>('DOKPLOY_API_URL') || '';
    this.dokployApiKey = this.configService.get<string>('DOKPLOY_API_KEY') || '';
    this.dokployApplicationId = this.configService.get<string>('DOKPLOY_APPLICATION_ID') || '';
  }

  async findAll() {
    return this.db.select().from(schema.customDomains).orderBy(schema.customDomains.createdAt);
  }

  async findOne(id: string) {
    const [domain] = await this.db
      .select()
      .from(schema.customDomains)
      .where(eq(schema.customDomains.id, id))
      .limit(1);

    if (!domain) {
      throw new NotFoundException(`Domain with id "${id}" not found`);
    }

    return domain;
  }

  async findByDomain(domain: string) {
    const [existing] = await this.db
      .select()
      .from(schema.customDomains)
      .where(eq(schema.customDomains.domain, domain))
      .limit(1);

    return existing || null;
  }

  async addDomain(dto: CreateDomainDto) {
    // Check if domain already exists
    const existing = await this.findByDomain(dto.domain);
    if (existing) {
      throw new ConflictException(`Domain "${dto.domain}" already exists`);
    }

    // Create domain record
    const [domain] = await this.db
      .insert(schema.customDomains)
      .values({
        domain: dto.domain,
        status: 'pending',
        sslStatus: 'none',
        deploymentStatus: 'pending',
      })
      .returning();

    this.logger.log(`Domain added: ${dto.domain}`);

    // Get DNS instructions
    const instructions = this.getDnsInstructions(dto.domain);

    return {
      domain,
      instructions,
    };
  }

  async verifyDomain(id: string) {
    const domain = await this.findOne(id);

    // Update status to verifying
    await this.db
      .update(schema.customDomains)
      .set({ status: 'verifying', updatedAt: new Date() })
      .where(eq(schema.customDomains.id, id));

    this.logger.log(`Verifying domain: ${domain.domain}`);

    // Check DNS
    const dnsResult = await this.dnsVerificationService.verifyDnsPointsToVps(domain.domain);

    if (dnsResult.verified) {
      // DNS verified
      await this.db
        .update(schema.customDomains)
        .set({
          status: 'verified',
          verifiedAt: new Date(),
          dnsRecordsChecked: JSON.stringify(dnsResult.records),
          updatedAt: new Date(),
        })
        .where(eq(schema.customDomains.id, id));

      this.logger.log(`Domain verified: ${domain.domain}`);

      // Deploy domain to Dokploy
      await this.deployDomain(id);

      return this.findOne(id);
    } else {
      // DNS verification failed - keep as pending so user can retry
      await this.db
        .update(schema.customDomains)
        .set({
          status: 'pending',
          updatedAt: new Date(),
        })
        .where(eq(schema.customDomains.id, id));

      this.logger.warn(`Domain verification failed: ${domain.domain} - ${dnsResult.error}`);

      return this.findOne(id);
    }
  }

  async deployDomain(id: string) {
    const domain = await this.findOne(id);

    // Update deployment status
    await this.db
      .update(schema.customDomains)
      .set({ deploymentStatus: 'deploying', updatedAt: new Date() })
      .where(eq(schema.customDomains.id, id));

    this.logger.log(`Deploying domain: ${domain.domain}`);

    try {
      // Call real Dokploy API
      const deploymentResult = await this.createDokployDomain(domain.domain);

      if (deploymentResult.success) {
        await this.db
          .update(schema.customDomains)
          .set({
            deploymentStatus: 'deployed',
            status: 'active',
            sslStatus: 'pending',
            dokployDomainId: deploymentResult.domainId,
            updatedAt: new Date(),
          })
          .where(eq(schema.customDomains.id, id));

        this.logger.log(`Domain deployed to Dokploy: ${domain.domain} (ID: ${deploymentResult.domainId})`);

        // Check SSL status after a delay (Dokploy auto-generates Let's Encrypt certs)
        setTimeout(async () => {
          await this.checkSslStatus(id);
        }, 10000);
      } else {
        throw new Error(deploymentResult.message || 'Deployment failed');
      }
    } catch (error) {
      await this.db
        .update(schema.customDomains)
        .set({
          deploymentStatus: 'failed',
          status: 'failed',
          errorMessage: error.message,
          updatedAt: new Date(),
        })
        .where(eq(schema.customDomains.id, id));

      this.logger.error(`Deployment failed: ${domain.domain}`, error);
    }
  }

  async removeDomain(id: string) {
    const domain = await this.findOne(id);

    // Delete from Dokploy first if we have the domain ID
    if (domain.dokployDomainId) {
      try {
        await this.deleteDokployDomain(domain.dokployDomainId);
        this.logger.log(`Domain removed from Dokploy: ${domain.domain}`);
      } catch (error) {
        this.logger.warn(`Failed to remove domain from Dokploy: ${error.message}`);
        // Continue with local deletion even if Dokploy fails
      }
    }

    await this.db
      .delete(schema.customDomains)
      .where(eq(schema.customDomains.id, id));

    this.logger.log(`Domain removed: ${domain.domain}`);

    return { message: 'Domain removed successfully' };
  }

  getDnsInstructions(domain: string) {
    const vpsIp = this.configService.get<string>('VPS_IP_ADDRESS') || 'YOUR_VPS_IP';
    return {
      domain,
      instructions: [
        {
          type: 'nameservers',
          title: 'Option 1: Nameservers (Recommended)',
          description: 'Update your domain nameservers at your registrar',
          records: [
            { name: 'Nameserver 1', value: process.env.NS1_DOMAIN || 'ns1.yourdomain.com' },
            { name: 'Nameserver 2', value: process.env.NS2_DOMAIN || 'ns2.yourdomain.com' },
          ],
        },
        {
          type: 'a_record',
          title: 'Option 2: A Record',
          description: 'Add an A record pointing to our server',
          records: [
            {
              type: 'A',
              name: '@',
              value: vpsIp,
              ttl: '3600',
            },
          ],
        },
      ],
    };
  }

  /**
   * Create a domain in Dokploy via API
   * POST /domain.create
   */
  private async createDokployDomain(host: string): Promise<{ success: boolean; domainId?: string; message?: string }> {
    if (!this.dokployApiUrl || !this.dokployApiKey || !this.dokployApplicationId) {
      this.logger.warn('Dokploy API not configured, skipping domain creation');
      return {
        success: true,
        domainId: 'mock-' + Date.now(),
        message: 'Dokploy not configured (mock mode)',
      };
    }

    const url = `${this.dokployApiUrl}/api/domain.create`;

    this.logger.log(`Calling Dokploy API: POST ${url}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.dokployApiKey,
      },
      body: JSON.stringify({
        host,
        applicationId: this.dokployApplicationId,
        https: true,
        certificateType: 'letsencrypt',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      this.logger.error(`Dokploy API error: ${response.status}`, errorData);
      throw new Error(errorData.message || `Dokploy API error: ${response.status}`);
    }

    const data = await response.json();
    this.logger.log(`Dokploy domain created: ${JSON.stringify(data)}`);

    return {
      success: true,
      domainId: data.domainId || data.id,
    };
  }

  /**
   * Delete a domain from Dokploy via API
   * POST /domain.delete
   */
  private async deleteDokployDomain(domainId: string): Promise<void> {
    if (!this.dokployApiUrl || !this.dokployApiKey) {
      this.logger.warn('Dokploy API not configured, skipping domain deletion');
      return;
    }

    const url = `${this.dokployApiUrl}/api/domain.delete`;

    this.logger.log(`Calling Dokploy API: POST ${url} (domainId: ${domainId})`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.dokployApiKey,
      },
      body: JSON.stringify({
        domainId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete domain from Dokploy: ${response.status}`);
    }

    this.logger.log(`Dokploy domain deleted: ${domainId}`);
  }

  /**
   * Check SSL certificate status from Dokploy
   */
  private async checkSslStatus(id: string) {
    const domain = await this.findOne(id);

    if (!domain.dokployDomainId || !this.dokployApiUrl || !this.dokployApiKey) {
      // Mock SSL status if Dokploy not configured
      await this.db
        .update(schema.customDomains)
        .set({
          sslStatus: 'active',
          sslIssuedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(schema.customDomains.id, id));
      this.logger.log(`SSL marked as active (mock) for: ${domain.domain}`);
      return;
    }

    try {
      const url = `${this.dokployApiUrl}/api/domain.one?domainId=${domain.dokployDomainId}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-api-key': this.dokployApiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Dokploy handles SSL automatically with Let's Encrypt
        // If domain is active, SSL should be provisioned
        await this.db
          .update(schema.customDomains)
          .set({
            sslStatus: 'active',
            sslIssuedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(schema.customDomains.id, id));
        this.logger.log(`SSL active for: ${domain.domain}`);
      }
    } catch (error) {
      this.logger.warn(`Failed to check SSL status for ${domain.domain}: ${error.message}`);
    }
  }
}
