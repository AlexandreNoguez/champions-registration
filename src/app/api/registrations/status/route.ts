import { NextResponse } from 'next/server';
import { getSerializedRegistrationStatus } from '@/features/registrations/services/getRegistrationStatus';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(getSerializedRegistrationStatus(), {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
