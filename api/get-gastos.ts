import { neon } from '@neondatabase/serverless';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).send('Method Not Allowed');

  const sql = neon(process.env.DATABASE_URL!);

  try {
    // Busca os gastos e já traz formatado para o seu Dashboard
    const data = await sql`SELECT * FROM gastos ORDER BY data DESC`;
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao buscar dados do Neon' });
  }
}