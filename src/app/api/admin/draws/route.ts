import { NextResponse } from 'next/server';
import { generateDraw, getCurrentDraw } from '@/features/draws/services/draw.service';
import { validateAdminRequest } from '@/features/admin/services/adminAuth';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authResult = validateAdminRequest(request);

  if (!authResult.isAuthorized) {
    return NextResponse.json(
      { message: authResult.message },
      { status: authResult.status }
    );
  }

  await connectToDatabase();

  return NextResponse.json(
    {
      draw: await getCurrentDraw(),
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}

export async function POST(request: Request) {
  const authResult = validateAdminRequest(request);

  if (!authResult.isAuthorized) {
    return NextResponse.json(
      { message: authResult.message },
      { status: authResult.status }
    );
  }

  await connectToDatabase();

  return NextResponse.json(
    {
      draw: await generateDraw(),
      message: 'Sorteio gerado com sucesso.',
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
