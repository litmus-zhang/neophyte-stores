import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    // ...
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
    redisUrl: process.env.REDIS_URL,

  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL,

  },
  modules: [
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          url: process.env.REDIS_URL,
        },
      },
    },
    {
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/locking-redis",
            id: "locking-redis",
            is_default: true,
            options: {
              redisUrl: process.env.LOCKING_REDIS_URL,
            },
          },
        ],
      },
    },
    // {
    //   resolve: "@medusajs/medusa/analytics",
    //   options: {
    //     providers: [
    //       {
    //         resolve: "@medusajs/analytics-posthog",
    //         id: "posthog",
    //         options: {
    //           posthogEventsKey: process.env.POSTHOG_EVENTS_API_KEY,
    //           posthogHost: process.env.POSTHOG_HOST,
    //         },
    //       },
    //     ],
    //   },
    // },
    {
      resolve: '@medusajs/medusa/file',
      options: {
        providers: [
          process.env.NODE_ENV === 'development'
            ? {
              resolve: '@medusajs/file-local',
              id: 'local',
              options: {
                upload_dir: 'static'
              }
            } :
            process.env.NODE_ENV === 'staging' ?
              {
                resolve: '@medusajs/medusa/file-s3',
                id: 's3',
                options: {
                  file_url: process.env.MINIO_FILE_URL, // e.g., http://localhost:9000/my-bucket
                  access_key_id: process.env.MINIO_ACCESS_KEY,
                  secret_access_key: process.env.MINIO_SECRET_KEY,
                  region: 'us-east-1',
                  bucket: process.env.MINIO_BUCKET,
                  endpoint: process.env.MINIO_ENDPOINT, // e.g., http://localhost:9000,
                  additional_client_config: {
                    forcePathStyle: true
                  }
                }
              } : {
                resolve: "@medusajs/medusa/file-s3",
                id: "s3",
                options: {
                  file_url: process.env.S3_FILE_URL,
                  access_key_id: process.env.S3_ACCESS_KEY_ID,
                  secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
                  region: process.env.S3_REGION,
                  bucket: process.env.S3_BUCKET,
                  endpoint: process.env.S3_ENDPOINT,
                  // other options...
                },
              },
        ]
      }
    },


  ],

});
