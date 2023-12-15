import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { Loading } from '../../../shared/Loading'
import { useFormik } from 'formik'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { Errors } from '../../../shared/Errors'
import {
  type productosValuesModificate,
  type ImagenState
} from '../../../shared/Interfaces'
import { ScheamaProductos } from '../../../shared/Schemas'
import Editor from '../../../shared/Editar'
import { ImageUpdate } from '../../../shared/ImageUpdate'

export const EditarProducto = (): JSX.Element => {
  const navigate = useNavigate()
  const { setTitle, token } = useAuth()
  const [resumen, setResumen] = useState('')
  const { id } = useParams()
  const [loadingComponents, setLoadingComponents] = useState(true)
  const [imagen1, setImagen1] = useState('')
  const [boton1, setBoton1] = useState(false)
  const [url1, setUrl1] = useState('')
  const [imagenNueva1, SetImagenNueva1] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  const getProducto = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/showProducto/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setValues({
      ...values,
      nombre: request.data.nombre
    })
    if (request.data.caracteristicas) {
      setResumen(request.data.caracteristicas)
    }
    setImagen1(request.data.imagen1)
    setLoadingComponents(false)
  }

  const saveCategoria = async (
    values: productosValuesModificate
  ): Promise<void> => {
    if (resumen.length < 10) {
      Swal.fire('Necesita compeltar el resumen del curso', '', 'warning')
      return
    }
    setLoadingComponents(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('nombre', values.nombre)
    if (imagenNueva1.archivo != null) {
      data.append('imagen1', imagenNueva1.archivo)
    }
    data.append('caracteristicas', resumen)
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(`${Global.url}/updateProducto/${id ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })

      if (respuesta.data.status == 'success') {
        Swal.fire('Curso actualizado correctamente', '', 'success')
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

  const {
    handleSubmit,
    handleChange,
    setValues,
    errors,
    values,
    touched,
    handleBlur,
    isSubmitting
  } = useFormik({
    initialValues: {
      nombre: ''
    },
    validationSchema: ScheamaProductos,
    onSubmit: saveCategoria
  })

  useEffect(() => {
    getProducto()
    setTitle('Registrar Curso')
  }, [])

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  return (
    <>
      {loadingComponents
        ? (
        <Loading />
          )
        : (
        <form
          className="bg-secondary-100 p-8 rounded-xl"
          onSubmit={handleSubmit}
        >
          <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-5">
            <div className="w-full lg:w-full">
              <TitleBriefs titulo="Título del curso" />
              <InputsBriefs
                name="nombre"
                type="text"
                value={values.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.nombre} touched={touched.nombre} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-24 relative mt-10">
            <p className="bg-transparent pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-25px]">
              Resumen del curso
            </p>
            <div className="flex-1 w-full md:w-3/4">
              <Editor content={resumen} setContent={setResumen} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-10 relative">
            <p className="bg-secondary-100 pt-0 pb-0 lg:pl-2  mr-0 mb-0 font-medium text-white text-md lg:absolute py-2 rounded-md top-[-10px]">
              Imagen del curso<span className="text-red-500">*</span>
            </p>
            <div className="flex-1 flex flex-col lg:flex-row  items-center gap-4">
              <ImageUpdate
                globalUrl="productos"
                url={url1}
                setUrl={setUrl1}
                boton={boton1}
                setBoton={setBoton1}
                imagen={imagen1}
                setImagen={SetImagenNueva1}
                clase="1"
              />
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
              type="submit"
              className="bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              value="Editar"
            />
          </div>
        </form>
          )}
    </>
  )
}
