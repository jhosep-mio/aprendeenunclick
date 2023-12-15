import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Loading } from '../../../shared/Loading'
import { type estudiantesValues } from '../../../shared/Interfaces'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import countryList from 'react-select-country-list'
import { format } from 'date-fns'
import Swal from 'sweetalert2'

export const VerEstudiante = (): JSX.Element => {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const { setTitle } = useAuth()
  const [loadingComponents, setLoadingComponents] = useState(true)
  const [estudiante, setEstudiante] = useState<estudiantesValues | null>(null)
  const [, setOptions] = useState([])
  const [creacion, setCreacion] = useState('')
  const [estado, setEstado] = useState('0')

  const getBanner = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/getEstudiante/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setEstudiante(request.data)
    setEstado(request.data.estado)
    setCreacion(format(new Date(request.data.created_at), 'dd/MM/yyyy'))
    setLoadingComponents(false)
  }

  const generarNombreDeUsuario = (nombreCompleto: string): string => {
    const partes = nombreCompleto.trim().split(/\s+/) // Dividir por uno o más espacios
    const iniciales = partes.map((nombre) => nombre[0]).join('')
    return `${iniciales.toLowerCase()}`
  }

  useEffect(() => {
    setOptions(countryList().getData())
  }, [])

  useEffect(() => {
    setTitle('')
    getBanner()
  }, [])

  const updateEstado = async (estate: string): Promise<void> => {
    setLoadingComponents(true)
    const data = new FormData()
    data.append('estado', estate)
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateEstado/${id ?? ''}`,
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
        Swal.fire('Estado cambiado', '', 'success')
        getBanner()
      } else {
        Swal.fire('Error al cambiar', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error al cambiar', '', 'error')
    }
    setLoadingComponents(false)
  }

  return (
    <>
      {loadingComponents
        ? <Loading />
        : (
            estudiante != null && (
          <form className="bg-secondary-100 p-8 rounded-xl">
            <div className="mb-4 flex justify-end">
              {estado == '0'
                ? <button
                  className="bg-red-600 py-4 w-fit px-6 rounded-xl"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={async () => {
                    await updateEstado('1')
                  }}
                >
                  Desactivar cuenta
                </button>
                : (
                <button
                  className="bg-green-600 py-4 w-fit px-6 rounded-xl"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={async () => {
                    await updateEstado('0')
                  }}
                >
                  Activar Cuenta
                </button>
                  )}
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-3">
              <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-5">
                <div className="w-full lg:w-2/3">
                  <TitleBriefs titulo="Nombres" />
                  <input
                    className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                    type="text"
                    value={estudiante.nombres}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="w-full lg:w-2/3">
                  <TitleBriefs titulo="Apellidos" />
                  <input
                    className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                    type="text"
                    value={estudiante.apellidos}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="w-full lg:w-2/3">
                  <TitleBriefs titulo="Usuario" />
                  <input
                    className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                    type="text"
                    value={generarNombreDeUsuario(
                      `${estudiante.nombres} ${estudiante.apellidos}`
                    )}
                    autoComplete="off"
                    disabled
                  />
                </div>
                <div className="w-full lg:w-2/3">
                  <TitleBriefs titulo="Email" />
                  <input
                    className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                    type="text"
                    value={estudiante.email}
                    autoComplete="off"
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-0">
              <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-5">
                <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-5">
                  <div className="w-full lg:w-full">
                    <TitleBriefs titulo="Telefono movil" />
                    <div className="w-full h-full flex gap-4 input_numeros">
                      <PhoneInput
                        disableCountryCode
                        disabled
                        country={'pe'}
                        value={estudiante.celular}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-full">
                    <TitleBriefs titulo="Edad" />
                    <input
                      className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                      type="text"
                      value={estudiante.edad}
                      autoComplete="off"
                      disabled
                    />
                  </div>
                  <div className="w-full ">
                    <TitleBriefs titulo="Cumpleaños" />
                    <input
                      className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                      type="text"
                      value={estudiante.cumpleaños}
                      autoComplete="off"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-3">
              <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-5">
                <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-5">
                  <div className="w-full lg:w-1/3">
                    <TitleBriefs titulo="Inscrito desde: " />
                    <input
                      className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                      type="text"
                      value={creacion}
                      autoComplete="off"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">PLAN ADQUIRIDO</h2>
            </div>

            <div className="flex gap-2 w-full justify-end">
              <input type="hidden" name="oculto" value="1" />
              <Link
                to="/admin/alumnos"
                className="bg-red-500 px-4 py-2 rounded-md text-white"
              >
                Regresar
              </Link>
            </div>
          </form>
            )
          )}
    </>
  )
}

export default VerEstudiante
