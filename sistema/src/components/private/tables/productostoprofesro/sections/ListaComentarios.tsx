import { useState, type Dispatch, type SetStateAction } from 'react'
import { Global } from '../../../../../helper/Global'
import { type comentariosValues } from '../../../../shared/Interfaces'
// import { type Dispatch, type SetStateAction } from 'react'
import { IoArrowUndoOutline } from 'react-icons/io5'
import { defaultperfil } from '../../../../shared/Images'

interface valuesProps {
  comentarios: comentariosValues[]
  claseId: string | undefined
  setOpen: Dispatch<SetStateAction<boolean>>
  setIdComentario: Dispatch<SetStateAction<string | undefined>>
  setTexto: Dispatch<SetStateAction<string | undefined>>
}

export const ListaComentarios = ({
  comentarios,
  claseId,
  setOpen,
  setIdComentario,
  setTexto
}: valuesProps): JSX.Element => {
  const [filtroActual, setFiltroActual] = useState('nuevos')

  const parseFechaHora = (fecha: string, hora: string): Date => {
    // Combina las cadenas de fecha y hora y luego crea un objeto Date
    const fechaHora = fecha.split('/').reverse().join('-') + 'T' + hora
    return new Date(fechaHora)
  }
  // Ordenar el array comentarios
  switch (filtroActual) {
    case 'sinResponder':
      comentarios = comentarios.filter(comentario =>
        !comentario.respuestas || comentario.respuestas.length == 0
      )
      break
    case 'nuevos':
    default:
      comentarios = comentarios.sort((a, b) => {
        const fechaHoraA = parseFechaHora(a.fecha, a.hora).getTime()
        const fechaHoraB = parseFechaHora(b.fecha, b.hora).getTime()
        return fechaHoraB - fechaHoraA // Esto ordenará de más reciente a más antiguo
      })
      break
  }

  return (
    <div className="w-full ">
      <h3 className="uppercase text-secondary-70 text-2xl w-full border-b-2 font-bold text-center py-2 border-secondary-70 mb-6">
        Comentarios
        <span className="text-secondary-10">
          (
          {
            comentarios.filter(
              (comentario: comentariosValues) =>
                comentario.clase === String(claseId)
            ).length
          }
          )
        </span>
      </h3>
      <div className="flex gap-4 mb-10">
        <p className="text-gray-300 text-2xl">Ordenar por:</p>
        <div className="flex gap-4">
          <span className={`${filtroActual == 'nuevos' ? 'bg-secondary-70 text-black/70' : 'bg-[#2C4164]  text-gray-300'} px-4 rounded-xl text-[1.3rem]  cursor-pointer`} onClick={() => { setFiltroActual('nuevos') }}>
            Nuevos
          </span>
          <span className={`${filtroActual == 'sinResponder' ? 'bg-secondary-70 text-black/70' : 'bg-[#2C4164]  text-gray-300'} px-4 rounded-xl text-[1.3rem] cursor-pointer`} onClick={() => { setFiltroActual('sinResponder') }}>
            Sin responder
          </span>
        </div>
      </div>
      {comentarios.length > 0 &&
        comentarios
          .filter(
            (comentario: comentariosValues) =>
              comentario.clase == String(claseId)
          )
          .map((comentario: comentariosValues, index: number) => (
            <div
              className="w-full bg-[#24385B] p-6 rounded-xl mb-6"
              key={index}
            >
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <div>
                    <img
                      src={
                        comentario.foto
                          ? `${Global.urlImages}/fotoperfil/${
                              comentario.foto ?? ''
                            }`
                          : defaultperfil
                      }
                      alt=""
                      className="w-16 h-16 object-contain rounded-full"
                    />
                  </div>
                  <div className="flex flex-col gap-0">
                    <span className="text-2xl">{comentario.user}</span>
                    <span className="text-gray-400 ">{comentario.fecha}</span>
                  </div>
                </div>
                <div className="px-4">
                  <p className="text-[1.4rem] break-words">
                    {comentario.texto}
                  </p>
                </div>
                <span
                  className="flex gap-2 text-secondary-70 items-center text-2xl px-4 cursor-pointer"
                  onClick={() => {
                    setOpen(true)
                    setIdComentario(String(comentario.id))
                    setTexto(comentario.texto)
                  }}
                >
                  <IoArrowUndoOutline /> Responder
                </span>
              </div>
                {comentario.respuestas?.length > 0 &&
              <div className='flex flex-col mt-10'>
                  {comentario.respuestas.map((respuesta: comentariosValues, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col gap-4 pl-20 relative py-4
                  after:absolute after:left-11 after:top-8 after:bottom-0 after:bg-secondary-10/50 after:h-1 after:w-6
                  before:absolute before:left-10 before:top-0 before:bottom-0 before:bg-secondary-10/50 before:h-full before:w-1
                  "
                    >
                      <div className="flex gap-4 items-center">
                        <div>
                          <img
                            src={
                              respuesta.foto
                                ? `${Global.urlImages}/fotoperfil/${respuesta.foto ?? ''}`
                                : defaultperfil
                            }
                            alt=""
                            className="w-16 h-16 object-contain rounded-full"
                          />
                        </div>
                        <div className="flex flex-col gap-0">
                          <span className="text-2xl">{respuesta.user}</span>
                          <span className="text-gray-400 ">{respuesta.fecha}</span>
                        </div>
                      </div>
                      <div className="px-4">
                        <p className="text-[1.4rem] break-words">
                          {respuesta.texto}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>}
            </div>
          ))}
    </div>
  )
}
