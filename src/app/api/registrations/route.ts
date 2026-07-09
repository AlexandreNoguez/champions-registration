import { NextResponse } from 'next/server';
import {
  createRegistration,
  DuplicateRegistrationError,
  RegistrationClosedError,
  RegistrationValidationError,
} from '@/features/registrations/services/createRegistration';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    const { registration } = await createRegistration(body);

    return NextResponse.json(
      {
        message: 'Inscrição realizada com sucesso.',
        registration,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: 'O corpo da requisição precisa ser um JSON válido.' },
        { status: 400 }
      );
    }

    if (error instanceof RegistrationValidationError) {
      return NextResponse.json(
        {
          message: 'Verifique os campos do formulário.',
          errors: error.details,
        },
        { status: 400 }
      );
    }

    if (error instanceof RegistrationClosedError) {
      return NextResponse.json(
        { message: 'As inscrições estão encerradas.' },
        { status: 403 }
      );
    }

    if (error instanceof DuplicateRegistrationError) {
      return NextResponse.json(
        { message: 'Um dos alunos informados já possui inscrição para esta turma.' },
        { status: 409 }
      );
    }

    return NextResponse.json({ message: 'Erro ao processar inscrição.' }, { status: 500 });
  }
}
