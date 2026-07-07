import { NextResponse } from 'next/server';
import {
  listAdminRegistrations,
  parseAdminRegistrationFilters,
} from '@/features/admin/services/listAdminRegistrations';
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

  try {
    const { searchParams } = new URL(request.url);
    const filters = parseAdminRegistrationFilters(searchParams);

    await connectToDatabase();

    return NextResponse.json(await listAdminRegistrations(filters), {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Filtros inválidos.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Erro ao consultar inscrições.' },
      { status: 500 }
    );
  }
}
