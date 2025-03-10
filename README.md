# PayloadCMS 3.0 Template

A clean and modern template for PayloadCMS 3.0 with PostgreSQL, S3 storage (LocalStack for development), and comprehensive testing setup.

## Features

- 🚀 PayloadCMS 3.0
- 📊 PostgreSQL Database
- 🗄️ S3 File Storage (with LocalStack for local development)
- ✨ Next.js Integration
- 🧪 Comprehensive Testing Setup (Unit & Integration)
- 🎨 ESLint + Prettier Configuration
- 🐳 Docker Compose Setup
- 🔒 Default Authentication
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

2. Copy the environment files:

   ```bash
   cp .env.example .env
   cp .env.example .env.test  # For testing environment
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

copy all the Required Environment from .env.example

## Available Scripts

### Development

- `npm run dev`: Start development server
- `npm run devsafe`: Start development server with clean .next directory
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run payload`: Run PayloadCMS CLI
- `npm run generate:types`: Generate TypeScript types
- `npm run generate:importmap`: Generate import map

### Testing

- `npm run test`: Run all tests (unit and integration)
- `npm run test:unit`: Run unit tests
- `npm run test:integration`: Run integration tests
- `npm run test:unit:watch`: Run unit tests in watch mode
- `npm run test:integration:watch`: Run integration tests in watch mode
- `npm run test:coverage`: Generate test coverage report

## Testing Approach

Our testing strategy focuses on ensuring reliable API functionality without relying on HTTP endpoints:

### Integration Testing Strategy

Instead of using traditional HTTP endpoint testing (like supertest), we've adopted a more direct approach:

1. **Direct Payload Instance**:

   ```typescript
   // Instead of HTTP calls:
   // const response = await request(app).post('/api/users')

   // We use direct Payload methods:
   const user = await payload.create({
     collection: 'users',
     data: { email: 'test@example.com' },
   })
   ```

2. **Benefits**:

   - Faster test execution (no HTTP overhead)
   - More reliable tests (fewer moving parts)
   - Direct access to Payload's internal methods
   - Better type safety and autocomplete
   - Easier debugging

3. **Test Database Management**:

   - Dedicated PostgreSQL instance for testing
   - Automatically started/stopped per test run
   - Fresh database for each test suite
   - Managed through shell scripts

4. **Test Structure**:

   ```typescript
   describe('Users Collection Integration', () => {
     let payload: Payload

     beforeEach(async () => {
       // Get fresh Payload instance for each test
       payload = await getPayload()
     })

     it('should create and authenticate user', async () => {
       // Create user directly
       const user = await payload.create({
         collection: 'users',
         data: {
           /* ... */
         },
       })

       // Test authentication
       const auth = await payload.login({
         collection: 'users',
         data: {
           /* ... */
         },
       })
     })
   })
   ```

5. **Cleanup Strategy**:
   - Automatic database cleanup after each test
   - Proper connection handling
   - Resource cleanup in `afterEach` and `afterAll` hooks

## Testing Setup

The project includes a comprehensive testing setup with both unit and integration tests:

### Unit Tests

- Located in `src/collections/__tests__/`
- Focus on testing collection configurations and utilities
- Fast execution, no database required
- Run with `npm run test:unit`

### Integration Tests

- Located in `tests/integration/`
- Test API endpoints and database interactions
- Require test database (automatically managed)
- Run with `npm run test:integration`

### Test Database

- Separate PostgreSQL instance for testing
- Automatically started/stopped during integration tests
- Configured through `.env.test`
- Managed by scripts in `scripts/` directory

## Docker Services

### PostgreSQL

- Port: 5433 (mapped from 5432)
- Username: payload
- Password: payload
- Database: payload

Test Database:

- Port: 5434 (mapped from 5432)
- Username: payload
- Password: payload
- Database: payload_test

### LocalStack (S3)

- Port: 4566
- Services: S3
- Persistence enabled
- Auto-creates required buckets on startup

### Adminer

- Port: 8080
- Default server: postgres

## File Storage (S3)

The template uses S3-compatible storage with LocalStack for development and testing:

### Development Setup

- Local development uses LocalStack as an S3 emulator
- Production can use any S3-compatible storage
- Automatic bucket creation and configuration
- Supports public read access for development

### Configuration

1. Environment Variables:

   ```bash
   AWS_ENDPOINT=http://localhost:4566  # LocalStack endpoint
   MEDIA_BUCKET_NAME=media            # Bucket name
   AWS_REGION=us-east-1              # Region
   ```

2. Verify LocalStack Setup:

   ```bash
   # Check if LocalStack is running
   docker-compose ps

   # Verify the media bucket exists
   aws --endpoint-url=http://localhost:4566 s3 ls
   ```

### Testing File Uploads

1. Through Admin Panel:

   - Access PayloadCMS admin panel (http://localhost:3000/admin)
   - Navigate to Media collection
   - Upload a file and fill required fields
   - Save the entry

2. Verify Uploads:

   ```bash
   # List all files in the media bucket
   aws --endpoint-url=http://localhost:4566 s3 ls s3://media/ --recursive

   # Download a specific file
   aws --endpoint-url=http://localhost:4566 s3 cp s3://media/media/filename.ext ./downloaded-file.ext
   ```

### Troubleshooting

- **Connection Issues**:

  - Verify LocalStack is running: `docker-compose ps`
  - Check LocalStack logs: `docker-compose logs localstack`
  - Ensure environment variables are set correctly

- **Upload Failures**:

  - Verify bucket permissions (files should be publicly readable)
  - Check PayloadCMS server logs
  - Ensure media bucket exists and is accessible

- **Common Solutions**:
  - Restart LocalStack: `docker-compose restart localstack`
  - Clear LocalStack data: `docker-compose down -v && docker-compose up -d`
  - Verify AWS CLI configuration: `aws --endpoint-url=http://localhost:4566 s3 ls`

## Directory Structure

```
.
├── src/
│   ├── app/                    # Next.js app directory
│   ├── collections/            # PayloadCMS collections
│   │   ├── __tests__/         # Collection unit tests
│   │   ├── Media.ts           # Media collection
│   │   └── Users.ts           # Users collection
│   └── payload.config.ts       # PayloadCMS configuration
├── tests/
│   ├── integration/           # Integration tests
│   ├── helpers/              # Test helpers
│   └── setup.ts              # Test setup file
├── scripts/                  # Utility scripts
│   ├── start-test-db.sh     # Start test database
│   └── stop-test-db.sh      # Stop test database
├── jest.config.mjs          # Base Jest configuration
├── jest.unit.config.mjs     # Unit test configuration
├── jest.integration.config.mjs # Integration test configuration
├── docker-compose.yml       # Docker services configuration
├── .env.example            # Environment variables template
└── .env.test              # Test environment variables
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
