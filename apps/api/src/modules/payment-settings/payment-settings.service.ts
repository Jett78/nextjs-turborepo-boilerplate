import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DB_CONNECTION } from '../../db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { UpdatePaymentSettingsDto } from './dto/update-payment-settings.dto';
import { encrypt, decrypt, isEncrypted } from '../../common/utils/encryption';

@Injectable()
export class PaymentSettingsService {
  private readonly logger = new Logger(PaymentSettingsService.name);

  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findByProvider(provider: string) {
    const [settings] = await this.db
      .select()
      .from(schema.paymentSettings)
      .where(eq(schema.paymentSettings.provider, provider))
      .limit(1);

    if (!settings) return null;

    const decryptedSecret = isEncrypted(settings.secretKey)
      ? decrypt(settings.secretKey)
      : settings.secretKey;

    return {
      ...settings,
      _decryptedSecret: decryptedSecret,
    };
  }

  async getCredentials(provider: string) {
    const settings = await this.findByProvider(provider);
    if (!settings || !settings.isEnabled) {
      return null;
    }

    return {
      secretKey: settings._decryptedSecret,
      publicKey: settings.publicKey,
      apiUrl: settings.apiUrl,
    };
  }

  async upsert(provider: string, dto: UpdatePaymentSettingsDto) {
    const existing = await this.findByProvider(provider);

    const encryptedSecret = encrypt(dto.secretKey);

    if (existing) {
      await this.db
        .update(schema.paymentSettings)
        .set({
          secretKey: encryptedSecret,
          publicKey: dto.publicKey,
          apiUrl: dto.apiUrl,
          isEnabled: dto.isEnabled !== undefined ? dto.isEnabled : existing.isEnabled,
          updatedAt: new Date(),
        })
        .where(eq(schema.paymentSettings.id, existing.id));
    } else {
      await this.db.insert(schema.paymentSettings).values({
        provider,
        secretKey: encryptedSecret,
        publicKey: dto.publicKey,
        apiUrl: dto.apiUrl,
        isEnabled: dto.isEnabled || false,
      });
    }

    return this.findByProvider(provider);
  }
}
