import { Module, Logger } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const DB_CONNECTION = 'DB_CONNECTION';

@Module({
  providers: [
    {
      provide: DB_CONNECTION,
      useFactory: async () => {
        const logger = new Logger('Database');
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
        });
        const client = await pool.connect();
        logger.log('Database connected successfully');
        client.release();
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DB_CONNECTION],
})
export class DbModule {}
