import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from './db'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const gastos = await sql`
      SELECT * FROM gastos
      ORDER BY created_at DESC
    `
    res.status(200).json(gastos)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar gastos' })
  }
}
