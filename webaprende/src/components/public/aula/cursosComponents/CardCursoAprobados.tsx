import { Link } from 'react-router-dom'
import {
  type valuesExamenesEntrada,
  type productosValues
} from '../../../shared/Interfaces'
import { Global } from '../../../../helper/Global'
import { extraerNumeroDesdeURL, formatearURL } from '../../../shared/funtions'
import { useEffect, useState } from 'react'
const CardCursoAprobados = ({
  curso,
  examenes,
  examenesCurso
}: {
  curso: productosValues
  examenes: valuesExamenesEntrada[]
  examenesCurso: valuesExamenesEntrada[]
}): JSX.Element => {
  const [validacion, setValidacion] = useState(false)
  useEffect(() => {
    const contieneId = examenes.some(
      (objeto: valuesExamenesEntrada) =>
        extraerNumeroDesdeURL(objeto.id) == String(curso.id)
    )
    setValidacion(contieneId)
  }, [examenes])
  return (
    <>
      {(() => {
        //   console.log(todasLasClasesCurso)
        const idreal: string = `${curso.id}-${curso.nombre}`.toLowerCase()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (examenesCurso[idreal]) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const clasesConProgreso = Object.keys(examenesCurso[idreal])
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const todasLasClasesCurso = curso.clase.flatMap((seccion: any) =>
            seccion.clase.map((clase: any) => clase.id)
          )
          const todasLasClasesEnProgreso = todasLasClasesCurso.every((clase: any) =>
            clasesConProgreso.includes(clase)
          )
          if (todasLasClasesEnProgreso) {
            return (
              <div className="bg-[#6363a24d] px-10 py-8 rounded-xl flex justify-between items-center gap-2">
                <div className="flex gap-6">
                  <span className="w-[60px] h-[60px] rounded-md bg-[#9a9ac192] flex items-center justify-center">
                    <img
                      src={`${Global.urlImages}/productos/${curso.imagen}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </span>
                  <div className="flex flex-col justify-center">
                    <h5 className="text-[#f2f2f2] text-3xl">{curso.nombre}</h5>
                    <p className="text-[#cccccc] text-xl">
                      {todasLasClasesEnProgreso ? 'Aprobado' : validacion ? 'En progreso' : 'Sin inicar'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-12">
                  <Link
                    to={`curso/${curso.id}-${formatearURL(curso.nombre)}`}
                    className="block px-8 py-4 bg-[#8282ff] text-2xl text-white rounded-md"
                  >
                    Ver curso
                  </Link>
                </div>
              </div>
            )
          } else {
            return null
          }
        }
      })()}
    </>
  )
}

export default CardCursoAprobados
