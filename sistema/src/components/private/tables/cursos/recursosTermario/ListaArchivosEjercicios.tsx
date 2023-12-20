import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { useParams } from 'react-router-dom'
import {
  type productosValues,
  type comentariosValues,
  type apuntesValues,
  type estudiantesValues
} from '../../../../shared/Interfaces'
import { useEffect, useState } from 'react'
import {
  RiArrowRightSLine,
  RiBookmark2Line,
  RiFolderZipLine
} from 'react-icons/ri'
import { defaultperfil } from '../../../../shared/Images'
import Swal from 'sweetalert2'
import { ModalCalificacion } from '../archivos/ModalCalificacion'

export const ListaArchivosEjercicios = (): JSX.Element => {
  const { id, claseId } = useParams()
  const tokenUser = localStorage.getItem('token')
  const [open, setOpen] = useState(false)
  const [, setArchivos] = useState<never[]>([])
  const [, setComentarios] = useState<comentariosValues[]>([])
  const [curso, setCurso] = useState<productosValues | null>(null)
  const [contenidos, setContenidos2] = useState<string[]>([])
  const getOneData = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/showAdmin/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${tokenUser ?? ''}`
      }
    })
    setComentarios(
      request.data[0].comentariosfinales
        ? JSON.parse(request.data[0].comentariosfinales)
        : []
    )
    const responseData = request.data[0]
    setContenidos2(JSON.parse(responseData.contenido))
    if (responseData.archivos) {
      setArchivos(JSON.parse(responseData.archivos))
    }
    setCurso(responseData)
  }
  const [nota, setNota] = useState<string>('')
  const [IdArchivo, setIdArchivo] = useState<string>('')
  const [estudiantes, setProductos] = useState<estudiantesValues[]>([])

  const getEstudiantes = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getEstudiantes`, {
      headers: {
        Authorization: `Bearer ${
          tokenUser !== null && tokenUser !== '' ? tokenUser : ''
        }`
      }
    })
    setProductos(request.data)
  }

  const descargarArchivo = async (nombre: string): Promise<void> => {
    const response = await axios.get(
      `${Global.url}/descargarRecurso99/${nombre ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${tokenUser ?? ''}`
        },
        responseType: 'blob'
      }
    )
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', nombre) // Asigna el nombre al archivo descargado
    document.body.appendChild(link)
    link.click()

    // Limpieza después de la descarga
    if (link.parentNode) {
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
  }

  const handleCalificar = async (): Promise<void> => {
    if (nota) {
      const notaNumerica = Number(nota)
      setArchivos((prevArchivos: any) => {
        const nuevosArchivos = prevArchivos.map((archivo: any) => {
          if (archivo.id === IdArchivo) {
            // Agrega la propiedad "nota" al archivo actual
            return {
              ...archivo,
              nota: notaNumerica
            }
          }
          return archivo
        })
        // Llama a enviarArchivo después de actualizar el estado
        enviarArchivo(nuevosArchivos)
        return nuevosArchivos
      })
    } else {
      Swal.fire('Debe colocar una nota', '', 'warning')
    }
  }

  const enviarArchivo = async (
    nuevosApuntes: apuntesValues[]
  ): Promise<void> => {
    const data = new FormData()
    data.append('archivos', JSON.stringify(nuevosApuntes))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/saveArchivo99/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              tokenUser !== null && tokenUser !== '' ? tokenUser : ''
            }`
          }
        }
      )
      if (respuesta.data.status == 'success') {
        Swal.fire('Calificación enviada', '', 'success')
        setNota('')
        getOneData()
        setOpen(false)
      } else {
        Swal.fire('Error al subir', '', 'error')
      }
    } catch (error: unknown) {
      console.log(error)
      Swal.fire('Error al subir', '', 'error')
    }
  }

  useEffect(() => {
    getOneData()
    getEstudiantes()
  }, [])

  return (
    <div className="w-full gap-10 max-w-[1450px] lg:px-0 mx-auto justify-start mt-6 grid grid-cols-1 lg:grid-cols-3 ">
      {contenidos.map((contenido: any) => (
        <>
          {contenido?.clase
            ?.filter((clase: any) => clase.id == claseId)
            .map((clase: any) => {
              return (
                <>
                  {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  JSON.parse(curso?.archivos)
                    ?.filter((archivo: any) => archivo.clase == clase.id)
                    .map((archivo: any) => (
                      <div
                        className="rounded-xl overflow-hidden shadow-md relative"
                        key={archivo.id}
                      >
                        <div className="absolute top-2 right-4 cursor-pointer flex flex-col gap-0 items-center justify-center">
                          <span
                            className="text-base underline text-black "
                            onClick={() => {
                              setOpen(true)
                              setIdArchivo(archivo.id)
                            }}
                          >
                            Calificar
                          </span>
                          <span className="text-2xl text-black">
                            {archivo.nota ? archivo.nota : ''}
                          </span>
                        </div>
                        <div className="bg-white rounded-3xl p-2 shadow-xl">
                          <div className="flex flex-row items-center gap-4 mb-6 p-4 mt-3">
                            <div className="flex items-center justify-center rounded-full w-10 h-10 min-w-[2rem]">
                              <RiFolderZipLine className="text-2xl text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-primary text-xl">
                                {clase.titulo}
                              </h3>
                            </div>
                          </div>
                          <div className="flex flex-row items-center justify-between gap-8 mb-2 px-4">
                            <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                              <div className="w-12 h-12 relative flex items-center">
                                <img
                                  src={defaultperfil}
                                  alt="Hombre"
                                  loading="lazy"
                                  className="rounded-full object-cover m-auto"
                                />
                              </div>
                              {estudiantes
                                .filter((estu) => estu.id == archivo.user)
                                .map((estu) => (
                                  <h5
                                    className="text-neutral-500 "
                                    key={estu.id}
                                  >
                                    {estu.nombres} {estu.apellidos}
                                  </h5>
                                ))}
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-2 text-neutral-600 w-full justify-end">
                              <RiBookmark2Line />
                            </div>
                          </div>
                          <div className="flex items-center justify-between  px-4 rounded-2xl">
                            <button
                              // onClick={() => { console.log() }}
                              // eslint-disable-next-line @typescript-eslint/no-misused-promises
                              onClick={async () => {
                                await descargarArchivo(archivo.respuestas)
                              }}
                              type="button"
                              className="flex items-center text-lg underline px-2 py-4 text-green-700 rounded-lg hover:bg-white transition-colors duration-300"
                            >
                              Descargar proyecto <RiArrowRightSLine />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </>
              )
            })}
        </>
      ))}
      <ModalCalificacion
        open={open}
        setOpen={setOpen}
        nota={nota}
        setNota={setNota}
        handleCalificar={handleCalificar}
      />
    </div>
  )
}
