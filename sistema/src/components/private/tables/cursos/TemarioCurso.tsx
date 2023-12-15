import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Loading } from '../../../shared/Loading'
import { AgregarSeccio } from './modals/AgregarSeccio'
import { type examenes, type temarioValues } from '../../../shared/Interfaces'
import { ListaTemario } from './recursosTermario/ListaTemario'
import Swal from 'sweetalert2'
import { TitleBriefs } from '../../../shared/TitleBriefs'

export const TemarioCurso = (): JSX.Element => {
  const { token } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const [openseccion, setOpenSeccion] = useState(false)
  const [examen, setExamen] = useState('')
  const [examenes, setExamenes] = useState([])
  const [examenes2, setExamenes2] = useState<never[]>([])
  // CLASE
  const { setTitle } = useAuth()
  const [loadingComponents, setLoadingComponents] = useState(true)
  const [contenido, setContenido] = useState<temarioValues[]>([])
  const [namesDelete, setImagesDelete] = useState<string[]>([])

  const getProducto = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/showProducto/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setTitle(request.data.nombre)
    setExamen(request.data.examen)
    if (request.data.contenido) {
      setContenido(JSON.parse(request.data.contenido))
    }
    setLoadingComponents(false)
  }

  const getExamenes = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/getExamenesEntrada`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setExamenes(request.data)
  }

  const getExamenes2 = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/getExamenes`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setExamenes2(request.data)
  }

  useEffect(() => {
    getExamenes()
    getExamenes2()
    getProducto()
  }, [])

  const saveTemario = async (): Promise<void> => {
    if (!examen) {
      Swal.fire('Debe seleccionar el examen de entrada', '', 'warning')
      return
    }
    setLoadingComponents(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('contenido', JSON.stringify(contenido))
    data.append('examen', examen)
    contenido.forEach((item) => {
      if (Array.isArray(item.clase)) {
        item.clase.forEach((clase) => {
          if (Array.isArray(clase.contenido)) {
            clase.contenido.forEach((image) => {
              if (image.file instanceof File) {
                data.append('images[]', image.file, image.filename)
              }
            })
          }
        })
      }
    })
    if (namesDelete) {
      data.append('namesDelete', JSON.stringify(namesDelete))
    }
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/saveTemario/${id ?? ''}`,
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
        Swal.fire('Temario actualizado', '', 'success')
        navigate('/admin/cursos')
      } else {
        Swal.fire('Error ', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
    setLoadingComponents(false)
  }

  return (
    <>
      {loadingComponents
        ? <Loading />
        : (
        <form className="bg-secondary-100 p-8 rounded-xl">
          <div className="w-full lg:relative mb-5 flex flex-col justify-between gap-2">
            <div className="w-full gap-6 items-center">
              <h2 className="font-medium text-white w-full text-center mb-8 text-3xl">
                TEMARIO DEL CURSO
              </h2>

              <div className="w-full lg:relative mb-5">
                <TitleBriefs titulo="EXAMEN DE ENTRADA" />
                <select
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                  value={examen}
                  onChange={(e) => {
                    setExamen(e.target.value)
                  }}
                >
                  <option value="">Seleccionar</option>
                  {examenes.map((exa: examenes) => (
                    <option value={exa.id} key={exa.id}>
                      {exa.titulo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="my-3 flex justify-end ">
                <button
                  type="button"
                  className="bg-main text-white font-bold px-4 py-2 rounded-xl"
                  onClick={() => {
                    setOpenSeccion(true)
                  }}
                >
                  Agregar Sección
                </button>
              </div>

              <div className="min-h-[60px] border border-black  placeholder-gray-400 outline-none focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900 rounded-md transition-all">
                <ListaTemario
                  contenido={contenido}
                  setContenido={setContenido}
                  setImagesDelete={setImagesDelete}
                  examenes={examenes2}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full justify-end pt-6">
            <input type="hidden" name="oculto" value="1" />
            <Link
              to="/admin/cursos"
              className="bg-red-500 px-4 py-2 rounded-md text-white"
            >
              Cancelar
            </Link>
            <input
              type="button"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => {
                await saveTemario()
              }}
              className="bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              value="Actualizar temario"
            />
          </div>
        </form>
          )}
      <AgregarSeccio
        open={openseccion}
        setOpen={setOpenSeccion}
        setContenido={setContenido}
      />
    </>
  )
}
