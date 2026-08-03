import { ApiProperty } from '@nestjs/swagger';

export class DomainEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  domain: string;

  @ApiProperty({ enum: ['pending', 'verifying', 'verified', 'active', 'failed'] })
  status: string;

  @ApiProperty({ required: false })
  verifiedAt: Date | null;

  @ApiProperty({ enum: ['pending', 'active', 'failed', 'none'] })
  sslStatus: string;

  @ApiProperty({ required: false })
  sslIssuedAt: Date | null;

  @ApiProperty({ enum: ['pending', 'deploying', 'deployed', 'failed'] })
  deploymentStatus: string;

  @ApiProperty({ required: false })
  errorMessage: string | null;

  @ApiProperty({ required: false })
  dnsRecordsChecked: string | null;

  @ApiProperty({ required: false })
  dokployDomainId: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<DomainEntity>) {
    Object.assign(this, partial);
  }
}
