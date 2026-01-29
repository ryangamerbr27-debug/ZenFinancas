export async function getGastos() {
  const response = await fetch('/api/get_gastos')
  return response.json()
}
