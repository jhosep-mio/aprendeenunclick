import { type miplanValues } from '../../../shared/Interfaces'

export const Fechas = ({
  fecha,
  miplan
}: {
  fecha: string
  miplan: miplanValues | null
}): JSX.Element => {
  const fechaInicio = new Date(fecha)
  // Parsea el valor de tiempo desde la descripción y conviértelo a número
  const tiempoEnMeses =
    parseInt(JSON.parse(miplan?.description ?? '').tiempo, 10) || 0
  // Suma el tiempo en meses a la fecha de inicio
  const fechaFin = new Date(fechaInicio)
  fechaFin.setMonth(fechaInicio.getMonth() + tiempoEnMeses)

  // Formatea ambas fechas
  const fechaInicioFormateada = fechaInicio.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const fechaFinFormateada = fechaFin.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Verifica si la fecha actual es posterior a la fecha de finalización
  const planTerminado = new Date() > fechaFin

  return (
    <p className="text-white text-2xl text-justify">
      <p>
        <strong>Detalle del plan:</strong>
      </p>
      Tu plan fue adquirido el <strong>{fechaInicioFormateada}</strong> y
      {planTerminado
        ? (
        <span className='text-red-400 font-bold'> ha finalizado. </span>
          )
        : <span>
          {' '}finaliza el <strong>{fechaFinFormateada}.</strong>
      </span>
      }
    </p>
  )
}
