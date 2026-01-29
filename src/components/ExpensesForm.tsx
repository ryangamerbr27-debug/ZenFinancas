import { useState } from 'react'
import { createGasto } from '../services/api'

export default function ExpensesForm() {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState(0)

  async function salvar() {
    await createGasto({
      descricao,
      valor,
      data: new Date().toISOString().split('T')[0],
      categoria: 'Outros',
      metodo_pagamento: 'Crédito'
    })

    alert('Gasto salvo!')
  }

  return (
    <div>
      <input
        placeholder="Descrição"
        value={descricao}
        onChange={e => setDescricao(e.target.value)}
      />

      <input
        type="number"
        value={valor}
        onChange={e => setValor(Number(e.target.value))}
      />

      <button onClick={salvar}>Salvar</button>
    </div>
  )
}
