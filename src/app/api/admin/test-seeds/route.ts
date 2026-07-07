import { NextResponse } from 'next/server';
import { validateAdminRequest } from '@/features/admin/services/adminAuth';
import { createTestSeeds, deleteTestSeeds } from '@/features/admin/services/testSeeds';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const authResult = validateAdminRequest(request);

  if (!authResult.isAuthorized) {
    return NextResponse.json(
      { message: authResult.message },
      { status: authResult.status }
    );
  }

  await connectToDatabase();

  return NextResponse.json(await createTestSeeds(), {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export async function DELETE(request: Request) {
  const authResult = validateAdminRequest(request);

  if (!authResult.isAuthorized) {
    return NextResponse.json(
      { message: authResult.message },
      { status: authResult.status }
    );
  }

  await connectToDatabase();

  return NextResponse.json(await deleteTestSeeds(), {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
