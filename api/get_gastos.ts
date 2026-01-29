import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from './db'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const gastos = await sql`
      SELECT
        id,
        descricao,
        data,
        categoria,
        metodo_pagamento,
        valor,
        sincronizado_em
      FROM gastos
      ORDER BY data DESC
    `
    res.status(200).json(gastos)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar gastos' })
  }
}
