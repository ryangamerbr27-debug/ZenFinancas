import { useState } from 'react'
import { createGasto } from '../services/api'

export default function ExpensesForm() {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState<number | ''>('')

  async function salvar() {
    if (!descricao || valor === '') {
      alert('Preencha descrição e valor')
      return
    }

    await createGasto({
      descricao,
      valor: Number(valor),
      data: new Date().toISOString().split('T')[0],
      categoria: 'Outros',
      metodo_pagamento: 'Crédito'
    })

    setDescricao('')
    setValor('')
    alert('Gasto salvo com sucesso!')
  }

  return (
    <div>
      <h2>Novo Gasto</h2>

      <input
        placeholder="Descrição"
        value={descricao}
        onChange={e => setDescricao(e.target.value)}
      />

      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={e => setValor(e.target.value === '' ? '' : Number(e.target.value))}
      />

      <button onClick={salvar}>Salvar</button>
    </div>
  )
}
