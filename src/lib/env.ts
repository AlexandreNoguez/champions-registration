import { z } from 'zod';

const localMongoUri = 'mongodb://admin:admin123@localhost:27017/champions?authSource=admin';

const serverEnvSchema = z.object({
  MONGODB_URI: z.string().min(1).default(localMongoUri),
  REGISTRATIONS_OPEN_AT: z.string().datetime().optional(),
  REGISTRATIONS_CLOSE_AT: z.string().datetime().optional(),
  ADMIN_TOKEN: z.string().min(16).optional(),
});

type ServerEnvInput = z.infer<typeof serverEnvSchema>;

export type ServerEnv = ServerEnvInput & {
  registrationsOpenAt?: Date;
  registrationsCloseAt?: Date;
};

let cachedEnv: ServerEnv | null = null;

export function getServerEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsedEnv = serverEnvSchema.parse(process.env);

  cachedEnv = {
    ...parsedEnv,
    registrationsOpenAt: parsedEnv.REGISTRATIONS_OPEN_AT
      ? new Date(parsedEnv.REGISTRATIONS_OPEN_AT)
      : undefined,
    registrationsCloseAt: parsedEnv.REGISTRATIONS_CLOSE_AT
      ? new Date(parsedEnv.REGISTRATIONS_CLOSE_AT)
      : undefined,
  };

  return cachedEnv;
}
