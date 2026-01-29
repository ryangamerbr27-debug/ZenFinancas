export async function getGastos() {
  const res = await fetch('/api/get_gastos')
  return res.json()
}

export async function createGasto(gasto: {
  descricao: string
  data: string
  categoria: string
  metodo_pagamento: string
  valor: number
}) {
  const res = await fetch('/api/create_gasto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gasto)
  })

  return res.json()
}
