import { Injectable, Logger } from '@nestjs/common';
import * as dns from 'dns/promises';

export interface DnsCheckResult {
  verified: boolean;
  method?: string;
  records?: any[];
  error?: string;
}

@Injectable()
export class DnsVerificationService {
  private readonly logger = new Logger(DnsVerificationService.name);

  async verifyDnsPointsToVps(domain: string): Promise<DnsCheckResult> {
    const vpsIp = process.env.VPS_IP_ADDRESS || '123.456.789.0';
    const mainDomain = process.env.MAIN_DOMAIN || 'yourdomain.com';

    this.logger.log(`Verifying DNS for: ${domain}`);

    try {
      // Check A record
      try {
        const aRecords = await dns.resolve4(domain);
        this.logger.log(`A records for ${domain}: ${aRecords.join(', ')}`);

        if (aRecords.includes(vpsIp)) {
          return {
            verified: true,
            method: 'a_record',
            records: aRecords,
          };
        }
      } catch (error) {
        this.logger.debug(`No A records for ${domain}: ${error.message}`);
      }

      // Check CNAME
      try {
        const cnameRecords = await dns.resolveCname(domain);
        this.logger.log(`CNAME records for ${domain}: ${cnameRecords.join(', ')}`);

        // Check if points to main domain
        if (cnameRecords.some(r => r.includes(mainDomain))) {
          return {
            verified: true,
            method: 'cname',
            records: cnameRecords,
          };
        }
      } catch (error) {
        this.logger.debug(`No CNAME records for ${domain}: ${error.message}`);
      }

      // Check NS records (nameservers)
      try {
        const nsRecords = await dns.resolveNs(domain);
        this.logger.log(`NS records for ${domain}: ${nsRecords.join(', ')}`);

        // If nameservers are set, domain might be using them
        // We'll still need to check if they point to us
      } catch (error) {
        this.logger.debug(`No NS records for ${domain}: ${error.message}`);
      }

      // DNS doesn't point to VPS
      return {
        verified: false,
        error: `Domain does not point to VPS IP (${vpsIp}). Please update DNS records.`,
      };

    } catch (error) {
      this.logger.error(`DNS verification error for ${domain}`, error);
      return {
        verified: false,
        error: `DNS lookup failed: ${error.message}`,
      };
    }
  }

  async getDnsRecords(domain: string) {
    const result: any = {};

    try {
      result.a = await dns.resolve4(domain);
    } catch {}

    try {
      result.cname = await dns.resolveCname(domain);
    } catch {}

    try {
      result.ns = await dns.resolveNs(domain);
    } catch {}

    try {
      result.mx = await dns.resolveMx(domain);
    } catch {}

    try {
      result.txt = await dns.resolveTxt(domain);
    } catch {}

    return result;
  }
}
