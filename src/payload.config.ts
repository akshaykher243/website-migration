// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import path from 'path';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import { Media } from './collections/Media';
import { Users } from './collections/Users';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const { PAYLOAD_SECRET, DATABASE_URI, MEDIA_BUCKET_NAME, AWS_ENDPOINT } =
  process.env;

// Validate required environment variables
if (!PAYLOAD_SECRET) {
  throw new Error('env var PAYLOAD_SECRET is required!');
}
if (!DATABASE_URI) {
  throw new Error('env var DATABASE_URI is required!');
}
if (!MEDIA_BUCKET_NAME) {
  throw new Error('env var MEDIA_BUCKET_NAME is required');
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: DATABASE_URI,
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      enabled: true,
      bucket: MEDIA_BUCKET_NAME,
      config: {
        ...(AWS_ENDPOINT
          ? {
              endpoint: AWS_ENDPOINT,
              forcePathStyle: true,
            }
          : {}),
      },
      collections: {
        media: true,
      },
    }),
  ],
});
