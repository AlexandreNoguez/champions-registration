import { RegistrationModel } from '@/models/Registration';

const obsoleteUniqueIndexNames = ['className_1_callNumber_1'];
const indexNotFoundCode = 27;
const namespaceNotFoundCode = 26;

export async function ensureRegistrationIndexes() {
  const indexes = await RegistrationModel.collection.indexes().catch((error: unknown) => {
    if (isMongoErrorCode(error, namespaceNotFoundCode)) {
      return [];
    }

    throw error;
  });

  await Promise.all(
    indexes
      .filter((index) => index.unique && obsoleteUniqueIndexNames.includes(index.name || ''))
      .map((index) => dropObsoleteIndex(index.name))
  );

  await RegistrationModel.createIndexes();
}

async function dropObsoleteIndex(indexName?: string) {
  if (!indexName) {
    return;
  }

  try {
    await RegistrationModel.collection.dropIndex(indexName);
  } catch (error) {
    if (!isMongoErrorCode(error, indexNotFoundCode)) {
      throw error;
    }
  }
}

function isMongoErrorCode(error: unknown, code: number) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: number }).code === code
  );
}
