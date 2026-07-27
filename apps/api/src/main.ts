import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription(`
## Authentication

This API uses **Better Auth** for authentication with session-based cookies.

### Auth Endpoints (Better Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/api/auth/sign-up/email\` | Register a new user |
| POST | \`/api/auth/sign-in/email\` | Login with email & password |
| POST | \`/api/auth/sign-out\` | Logout (invalidate session) |
| GET | \`/api/auth/get-session\` | Get current session |
| GET | \`/api/auth/ok\` | Health check |

### Sign Up Request
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
\`\`\`

### Sign In Request
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

### Response Format
\`\`\`json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "session": {
    "id": "session-id",
    "token": "session-token",
    "userId": "user-uuid",
    "expiresAt": "2024-01-08T00:00:00.000Z"
  }
}
\`\`\`

**Note:** Session cookie is set automatically on sign-in/sign-up. Use the cookie for authenticated requests.
    `)
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints (profile)')
    .addTag('blogs', 'Blog management')
    .addTag('upload', 'File upload to S3')
    .addTag('company-profile', 'Company profile management')
    .addTag('testimonials', 'Testimonial management')
    .addTag('inquiries', 'Inquiry management')
    .addTag('seo', 'Global SEO settings (meta tags, GTM, Search Console)')
    .addTag('page-seo', 'Per-page SEO settings')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/api`);
}
bootstrap();
