import { ApiProperty } from '@nestjs/swagger';

export class PaymentSettingsEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  publicKey: string;

  @ApiProperty()
  apiUrl: string;

  @ApiProperty()
  isEnabled: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  secretKey: string;

  constructor(partial: Partial<PaymentSettingsEntity> & { _decryptedSecret?: string }) {
    Object.assign(this, partial);
    if (partial._decryptedSecret) {
      this.secretKey = partial._decryptedSecret;
    }
  }
}
