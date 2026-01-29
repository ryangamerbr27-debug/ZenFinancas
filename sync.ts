import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const sql = neon(process.env.DATABASE_URL!);
  const { descricao, data, categoria, valor } = JSON.parse(req.body);

  try {
    await sql`
      INSERT INTO gastos (descricao, data, categoria, valor, sincronizado_em)
      VALUES (${descricao}, ${data}, ${categoria}, ${valor}, NOW())
    `;
    return res.status(200).json({ message: 'Gasto salvo com sucesso!' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao salvar no banco' });
  }
}
