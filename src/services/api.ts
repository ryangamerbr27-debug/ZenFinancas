export async function getGastos() {
  const res = await fetch('/api/get_gastos')
  return res.json()
}
