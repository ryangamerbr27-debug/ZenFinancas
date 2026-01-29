import type { VercelRequest, VercelResponse } from '@vercel/node'
import { sql } from './db'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const {
    descricao,
    data,
    categoria,
    metodo_pagamento,
    valor
  } = req.body

  // validação básica (iniciante friendly)
  if (!descricao || !data || !categoria || !metodo_pagamento || !valor) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' })
  }

  try {
    await sql`
      INSERT INTO gastos (
        descricao,
        data,
        categoria,
        metodo_pagamento,
        valor,
        sincronizado_em
      )
      VALUES (
        ${descricao},
        ${data},
        ${categoria},
        ${metodo_pagamento},
        ${valor},
        NOW()
      )
    `

    res.status(201).json({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao criar gasto' })
  }
}
