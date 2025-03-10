# PayloadCMS 3.0 Template

A clean and modern template for PayloadCMS 3.0 with PostgreSQL, S3 storage (LocalStack for development), and comprehensive testing setup.

## Features

- 🚀 PayloadCMS 3.0
- 📊 PostgreSQL Database
- 🗄️ S3 File Storage (with LocalStack for local development)
- ✨ Next.js Integration
- 🎨 ESLint + Prettier Configuration
- 🐳 Docker Compose Setup
- 📝 TypeScript Support

## Prerequisites

- Node.js ^18.20.2 || >=20.9.0
- Docker and Docker Compose
- npm (Node Package Manager)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/akshaykher243/website-migration
   cd website-migration
   ```

2. Copy the environment file:

   ```bash
   cp .env.example .env
   ```

3. Start the Docker services:

   ```bash
   docker-compose up -d
   ```

   This will start:

   - PostgreSQL database
   - LocalStack (S3 emulator)
   - Adminer (Database management)
   - Optional: PayloadCMS service (if ENABLE_PAYLOAD_SERVICE is set)

4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Refer to .env.example for required environment variables and configurations.

## Available Scripts

- `npm run dev`: Start development server
- `npm run devsafe`: Start development server with clean .next directory
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run payload`: Run PayloadCMS CLI
- `npm run generate:types`: Generate TypeScript types
- `npm run generate:importmap`: Generate import map

## Docker Services

### PostgreSQL

- Port: 5432
- Username: payload
- Password: payload
- Database: payload

### LocalStack (S3)

- Port: 4566
- Services: S3
- Persistence enabled
- Auto-creates required buckets on startup

### Adminer

- Port: 8080
- Default server: postgres

## File Storage

The template uses S3-compatible storage with LocalStack for development:

- Local development uses LocalStack as an S3 emulator
- Production can use any S3-compatible storage
- Automatic bucket creation and configuration
- Supports public read access for development

### Testing File Uploads with LocalStack

1. Ensure LocalStack is running:

   ```bash
   docker-compose ps
   ```

   You should see the LocalStack service running on port 4566.

2. Verify the media bucket exists:

   ```bash
   aws --endpoint-url=http://localhost:4566 s3 ls
   ```

   You should see a 'media' bucket listed.

3. Upload test:

   - Go to PayloadCMS admin panel (http://localhost:3000/admin)
   - Navigate to the Media collection
   - Click "Create New"
   - Upload an image file and fill required fields
   - Save the entry

4. Verify upload:

   ```bash
   # List all files in the media bucket
   aws --endpoint-url=http://localhost:4566 s3 ls s3://media/ --recursive

   # Download a specific file (replace filename.ext with actual filename)
   aws --endpoint-url=http://localhost:4566 s3 cp s3://media/media/filename.ext ./downloaded-file.ext
   ```

5. Resource Browser (LocalStack UI):

   - View and manage AWS resources through the LocalStack Web Application.
   - Navigate to Storage Resource Group > S3 Services to see bucket data.

6. Troubleshooting:
   - Ensure all environment variables are set correctly in .env
   - Check LocalStack logs: `docker-compose logs localstack`
   - Verify bucket permissions: Files should be publicly readable
   - Check PayloadCMS server logs for any upload errors

## Development Tools

### ESLint

- TypeScript support
- Next.js configurations
- Prettier integration

### Prettier

- Consistent code formatting
- Pre-configured rules
- VSCode integration

### TypeScript

- Strict type checking
- Automatic type generation for PayloadCMS
- Next.js type definitions

## Directory Structure

```
.
├── src/
│   ├── app/                 # Next.js app directory
│   ├── collections/         # PayloadCMS collections
│   └── payload.config.ts    # PayloadCMS configuration
├── scripts/                 # Utility scripts
├── docker-compose.yml       # Docker services configuration
└── .env.example            # Environment variables template
```
