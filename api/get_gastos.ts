import { neon } from '@neondatabase/serverless';

export default async function handler(req: Request) {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const gastos = await sql`
      SELECT
        id,
        descricao,
        data,
        categoria,
        metodo_pagamento,
        valor
      FROM gastos
      ORDER BY data DESC
    `;

    return new Response(JSON.stringify(gastos), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ error: 'Erro ao buscar gastos' }),
      { status: 500 }
    );
  }
}
