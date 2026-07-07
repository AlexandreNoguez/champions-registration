import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { advanceDrawWinner, generateDraw, getCurrentDraw } from '@/features/draws/services/draw.service';
import { validateAdminRequest } from '@/features/admin/services/adminAuth';
import { tournamentGameValues } from '@/features/registrations/domain';
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

const advanceWinnerSchema = z.object({
  game: z.enum(tournamentGameValues),
  matchId: z.string().min(1),
  winnerSlot: z.enum(['slotA', 'slotB']),
});

export async function PATCH(request: Request) {
  const authResult = validateAdminRequest(request);

  if (!authResult.isAuthorized) {
    return NextResponse.json(
      { message: authResult.message },
      { status: authResult.status }
    );
  }

  try {
    const body = advanceWinnerSchema.parse(await request.json());

    await connectToDatabase();

    return NextResponse.json(
      {
        draw: await advanceDrawWinner(body.game, body.matchId, body.winnerSlot),
        message: 'Vencedor avançado com sucesso.',
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: 'Dados do vencedor inválidos.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: getAdvanceWinnerErrorMessage(error) },
      { status: 400 }
    );
  }
}

function getAdvanceWinnerErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return 'Não foi possível avançar o vencedor.';
  }

  const knownMessages: Record<string, string> = {
    'Draw not found': 'Gere um sorteio antes de avançar vencedores.',
    'Game draw not found': 'A chave deste jogo não foi encontrada.',
    'Match not found': 'Este confronto não foi encontrado no sorteio atual.',
    'Selected slot does not have a participant': 'Este espaço ainda não tem competidor para avançar.',
  };

  return knownMessages[error.message] || 'Não foi possível avançar o vencedor.';
}
