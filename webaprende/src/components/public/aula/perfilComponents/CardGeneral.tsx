import { Link } from 'react-router-dom'
import perfil from '../../../../assets/aula/perfil/perfil.png'
import useAuth from '../../../../hooks/useAuth'
import { Global } from '../../../../helper/Global'
import {
  type productosValues,
  type valuesExamenesEntrada
} from '../../../shared/Interfaces'
const CardGeneral = ({
  cursos,
  examenesCurso
}: {
  cursos: productosValues[]
  examenesCurso: valuesExamenesEntrada[]
}): JSX.Element => {
  const { auth } = useAuth()
  let completados = 0
  let progreso = 0
  let sininiciar = 0

  cursos.forEach((curso) => {
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
      // Verificar si todas las clases del curso están en progreso
      const todasLasClasesEnProgreso = todasLasClasesCurso.every((clase: any) =>
        clasesConProgreso.includes(clase)
      )
      // Incrementar el contador si todas las clases están en progreso
      if (todasLasClasesEnProgreso) {
        completados++
      } else {
        progreso++
      }
    } else {
      sininiciar++
    }
  })
  return (
    <>
      <div className="flex flex-col bg-[#6363a24d] rounded-2xl px-8 pb-12 py-5">
        <div className="flex flex-col">
          <span className="w-[150px] h-[150px] rounded-full block mx-auto">
            <img
              src={
                auth.foto
                  ? `${Global.urlImages}/fotoperfil/${auth.foto}`
                  : perfil
              }
              alt=""
              className="rounded-full w-full h-full object-contain"
            />
          </span>
          <p className="text-center text-white text-4xl mt-6 font-Quicksand">
            {auth.onlyname}
          </p>
        </div>
        <Link
          to="/aula/perfil"
          className="text-center mt-8 text-[#9898ff] text-3xl underline"
        >
          Ver perfil
        </Link>
        <div className="grid mt-20 grid-cols-2 px-8 gap-10">
          <div className="bg-[#9a9ac192] p-5 py-12 rounded-lg flex flex-col">
            <p className="text-white text-3xl text-center font-bold">
              Completados
            </p>
            <span className="font-bold text-center mt-8 text-4xl text-[#9898ff]">
              {completados}
            </span>
          </div>
          <div className="bg-[#9a9ac192] p-5 py-12 rounded-lg flex flex-col">
            <p className="text-white text-3xl text-center font-bold">
              En progreso
            </p>
            <span className="font-bold text-center mt-8 text-4xl text-[#9898ff]">
              {progreso}
            </span>
          </div>
          <div className="bg-[#9a9ac192] p-5 py-12 rounded-lg flex flex-col">
            <p className="text-white text-3xl text-center font-bold">
              Sin iniciar
            </p>
            <span className="font-bold text-center mt-8 text-4xl text-[#9898ff]">
              {sininiciar}
            </span>
          </div>
          <div className="bg-[#9a9ac192] p-5 py-12 rounded-lg flex flex-col">
            <p className="text-white text-3xl text-center font-bold">
              En total
            </p>
            <span className="font-bold text-center mt-8 text-4xl text-[#9898ff]">
              {cursos.length}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default CardGeneral
