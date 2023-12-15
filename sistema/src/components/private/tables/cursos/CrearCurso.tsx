import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { Loading } from '../../../shared/Loading'
import { useFormik } from 'formik'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { Errors } from '../../../shared/Errors'
import { ImageUploader } from '../../../shared/ImageUploader'
import {
  type productosValuesModificate,
  type ImagenState
} from '../../../shared/Interfaces'
import { ScheamaProductos } from '../../../shared/Schemas'
import Editor from '../../../shared/Editar'

export const CrearCurso = (): JSX.Element => {
  const navigate = useNavigate()
  const [resumen, setResumen] = useState('')
  // CLASE
  const { setTitle } = useAuth()
  const [loadingComponents, setLoadingComponents] = useState(false)
  const [imagen1, setImagen1] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })
  const [boton1, setBoton1] = useState(false)
  const [url1, setUrl1] = useState('')

  useEffect(() => {
    setTitle('Registrar Curso')
  }, [])

  const saveCategoria = async (
    values: productosValuesModificate
  ): Promise<void> => {
    if (resumen.length < 10) {
      Swal.fire('Necesita compeltar el resumen del curso', '', 'warning')
      return
    }
    if (!imagen1.archivo) {
      Swal.fire('Necesita subir la imagend el curso', '', 'warning')
      return
    }
    setLoadingComponents(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('nombre', values.nombre)
    if (imagen1.archivo != null) {
      data.append('imagen1', imagen1.archivo)
    }
    data.append('caracteristicas', resumen)
    try {
      const respuesta = await axios.post(`${Global.url}/saveProducto`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })

      if (respuesta.data.status == 'success') {
        Swal.fire('Agregado correctamente', '', 'success')
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
        ? <Loading />
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
              <ImageUploader
                url={url1}
                setUrl={setUrl1}
                boton={boton1}
                setBoton={setBoton1}
                setImagen={setImagen1}
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
              value="Registrar"
            />
          </div>
        </form>
          )}
    </>
  )
}
