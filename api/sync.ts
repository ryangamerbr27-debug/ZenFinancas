import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  // 1. Verifica se o método é POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: 'DATABASE_URL não configurada no Vercel' });
  }

  const sql = neon(databaseUrl);
  
  // 2. O App envia um objeto { data: expenses[] }, então pegamos o array 'data'
  const { data } = req.body;

  try {
    // 3. Como o App envia uma lista, usamos um loop para salvar cada item
    for (const e of data) {
      await sql`
        INSERT INTO gastos (id, descricao, data, categoria, metodo_pagamento, valor, sincronizado_em)
        VALUES (
          ${e.id}, 
          ${e.description}, 
          ${e.date}, 
          ${e.category}, 
          ${e.paymentMethod || 'Não informado'}, 
          ${e.amount}, 
          NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          descricao = EXCLUDED.descricao,
          valor = EXCLUDED.valor,
          categoria = EXCLUDED.categoria;
      `;
    }

    return res.status(200).json({ message: 'Sincronização concluída com sucesso!' });
  } catch (error: any) {
    console.error("Erro no Neon:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
