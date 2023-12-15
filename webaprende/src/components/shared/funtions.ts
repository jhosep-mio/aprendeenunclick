export function formatearURL (nombre: string): string {
  // Eliminar espacios al principio y al final del nombre
  let url = nombre.trim()
  // Convertir a minúsculas
  url = url.toLowerCase()
  // Reemplazar espacios por guiones
  url = url.replace(/ /g, '-')
  // Reemplazar barras '/' por nada (eliminarlas)
  url = url.replace(/\//g, '')
  return url
}

export function extraerNumeroDesdeURL (url: string | undefined): string | undefined {
  if (url != undefined) {
    const matches = url.match(/\d+/)
    return matches ? matches[0] : undefined
  }
  return undefined
}

export const formatTime = (seconds: number): string => {
  const pad = (num: number, size: number): string => num.toString().padStart(size, '0')
  const hours = pad(Math.floor(seconds / 3600), 2)
  const minutes = pad(Math.floor((seconds % 3600) / 60), 2)
  const sec = pad(Math.floor(seconds % 60), 2)
  return `${hours}:${minutes}:${sec}`
}
