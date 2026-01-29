import { neon } from '@neondatabase/serverless';

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Método não permitido' }),
      { status: 405 }
    );
  }

  try {
    const body = await req.json();
    const {
      descricao,
      data,
      categoria,
      metodo_pagamento,
      valor
    } = body;

    if (
      !descricao ||
      !data ||
      !categoria ||
      !metodo_pagamento ||
      valor === undefined
    ) {
      return new Response(
        JSON.stringify({ error: 'Dados inválidos' }),
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    const result = await sql`
      INSERT INTO gastos (
        descricao,
        data,
        categoria,
        metodo_pagamento,
        valor
      )
      VALUES (
        ${descricao},
        ${data},
        ${categoria},
        ${metodo_pagamento},
        ${valor}
      )
      RETURNING *
    `;

    return new Response(JSON.stringify(result[0]), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ error: 'Erro ao criar gasto' }),
      { status: 500 }
    );
  }
}
