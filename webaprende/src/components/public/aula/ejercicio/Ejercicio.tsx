import { useState, type Dispatch, type SetStateAction, useEffect } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { type comentariosValues } from '../../../shared/Interfaces'
import useAuth from '../../../../hooks/useAuth'
import { Global } from '../../../../helper/Global'
import { extraerNumeroDesdeURL } from '../../../shared/funtions'

interface valuesProps {
  claseId: string | undefined
  cursoId: string | undefined
  archivos: comentariosValues[]
  setArchivos: Dispatch<SetStateAction<comentariosValues[]>>
  setProgresoClases: (cursoId: string | undefined, claseId: string | undefined) => void
  getApuntes: () => Promise<void>
}
interface verificacionI {
  verificacion: boolean
  objeto: comentariosValues
}

export const Ejercicio = ({
  claseId,
  cursoId,
  archivos,
  setArchivos,
  setProgresoClases
}: valuesProps): JSX.Element => {
  const { auth } = useAuth()
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)

  const [verifiacion, setVerificacion] = useState<verificacionI | null>(null)
  const token = localStorage.getItem('tokenUser')
  const tokenUser = localStorage.getItem('tokenUser')

  const obtenerFecha = (): string => {
    const fecha = new Date()
    return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`
  }

  const obtenerHora = (): string => {
    const fecha = new Date()
    return `${fecha.getHours()}:${fecha
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
  }

  const enviarArchivo = async (): Promise<void> => {
    if (texto) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const nombreunico = file ? `${uuidv4()}_${file.name}` : ''
      setLoading(true)
      const nuevoResumen = {
        id: Date.now(),
        texto,
        fecha: obtenerFecha(),
        foto: auth.foto,
        hora: obtenerHora(),
        clase: claseId,
        user: auth.id,
        idUser: auth.id,
        respuestas: file ? nombreunico : ''
      }
      setArchivos(
        (resumenesPrevios: comentariosValues[]): comentariosValues[] => {
          const nuevosResumenes = [...resumenesPrevios || [], nuevoResumen]
          const enviarDatos = async (): Promise<void> => {
            const data = new FormData()
            data.append('archivos', JSON.stringify(nuevosResumenes))
            if (file) {
              data.append('file', file)
              data.append('namefile', nombreunico)
            }
            data.append('_method', 'PUT')
            try {
              const respuesta = await axios.post(
                `${Global.url}/saveArchivo/${extraerNumeroDesdeURL(cursoId) ?? ''}`,
                data,
                {
                  headers: {
                    Authorization: `Bearer ${
                      token !== null && token !== '' ? token : ''
                    }`
                  }
                }
              )
              if (respuesta.data.status == 'success') {
                Swal.fire('Archivo enviado', '', 'success')
                setTexto('')
                setFile(null)
              } else {
                Swal.fire('Error al subir', '', 'error')
              }
            } catch (error: unknown) {
              console.log(error)
              Swal.fire('Error al subir', '', 'error')
            }
          }
          enviarDatos()
          setProgresoClases(cursoId, claseId)
          return nuevosResumenes
        }
      )
      setTexto('')
      setLoading(false)
    } else {
      Swal.fire('Ingrese contenido', '', 'warning')
    }
  }

  useEffect(() => {
    if (claseId && archivos) {
      const verificarClaseId = (
        array: comentariosValues[],
        claseId: string
      ): { encontrado: boolean, objeto?: comentariosValues } => {
        const objetoEncontrado = array.find(
          (item: comentariosValues) => item.clase == claseId && item.user == auth.id
        )
        return {
          encontrado: objetoEncontrado !== undefined,
          objeto: objetoEncontrado
        }
      }
      const resultado = verificarClaseId(archivos, claseId ?? '')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setVerificacion(resultado)
      setLoading(false)
    }
  }, [archivos, claseId])

  const descargarArchivo = async (nombre: string): Promise<void> => {
    const response = await axios.get(
      `${Global.url}/descargarRecurso/${nombre ?? ''}`,
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

  return (
    <>
      {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      verifiacion?.encontrado == false
        ? <>
          <h2 className="w-full text-3xl font-bold text-white uppercase text-left mb-6 mt-10">
            ADJUNTAR CONTENIDO Y ARCHIVOS
          </h2>
          <div className="w-full rounded-xl mb-6">
            <p className="w-full rounded-xl  border border-gray-400  text-gray-300 flex items-center gap-4 p-4">
              <textarea
                className="outline-none h-96 w-full resize-y text-3xl p-2 bg-transparent"
                rows={10}
                placeholder="Adjuntar texto"
                value={texto}
                onChange={(e) => {
                  setTexto(e.target.value)
                }}
              ></textarea>
            </p>
            <div className="relative mt-6 flex gap-3 items-center">
              <div className="w-[350px] h-fit relative group">
                <input
                  type="file"
                  className="file:hidden w-full h-full absolute inset-0 outline-none opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files != null) {
                      const selectedFile = e.target.files[0]
                      setFile(selectedFile)
                    }
                  }}
                />
                <button className="px-4 bg-red-600 py-2 text-2xl group-hover:bg-red-700 transition-colors text-white">
                  ADJUNTAR ARCHIVO
                </button>
              </div>
              {file && <p className="w-full line-clamp-1 text-white text-2xl">{file.name}</p>}
            </div>
          </div>
          <button
            type="button"
            className="mt-6 px-4 bg-green-600 py-4 text-2xl transition-colors hover:bg-green-700"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={async () => {
              await enviarArchivo()
            }}
          >
            ENVIAR
          </button>
        </>
        : (
            !loading &&
        verifiacion?.objeto && (
          <div>
            {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            verifiacion?.objeto.nota
              ? <h2 className="w-full text-3xl font-bold text-green-600 uppercase text-left mb-6 mt-10 underline">
            Tu respuesta fue revisada
        </h2>
              : <h2 className="w-full text-3xl font-bold text-white uppercase text-left mb-6 mt-10 underline">
                Tu respuesta fue enviada para su revisión.
            </h2>
        }
            {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            verifiacion?.objeto.nota &&
            <h2 className="w-full text-3xl font-bold text-gray-300 uppercase text-left mb-6 ">
              CALIFICACIÓN: <span className='font-bold text-4xl'>{
               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
              verifiacion?.objeto.nota}</span>
            </h2>}
            <div className="w-full rounded-xl mb-6">
              <p className="w-full rounded-xl  border border-gray-400  text-gray-300 flex items-center gap-4 p-4">
                <textarea
                  className="outline-none h-96 w-full resize-y text-3xl p-2 bg-transparent"
                  rows={10}
                  placeholder="Adjuntar texto"
                  value={verifiacion?.objeto.texto}
                ></textarea>
              </p>

              <div
                className="relative mt-6 flex gap-3 items-center text-blue-600 cursor-pointer"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={async () => {
                  await descargarArchivo(verifiacion?.objeto.respuestas)
                }}
              >
                {verifiacion?.objeto.respuestas && (
                  <p className="w-full line-clamp-1 text-2xl">
                    {verifiacion?.objeto.respuestas}
                  </p>
                )}
              </div>
            </div>
          </div>
            )
          )}
    </>
  )
}
