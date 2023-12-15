import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { Loading } from '../../../shared/Loading'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { Errors } from '../../../shared/Errors'
import { useFormik } from 'formik'
import { SchemaMarcas } from '../../../shared/Schemas'
import { MdDeleteForever } from 'react-icons/md'
import { FaChevronCircleUp, FaImage } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { v4 as uuidv4 } from 'uuid'
import { TiDelete } from 'react-icons/ti'
import { ViewImage } from './modal/ViewImage'
import {
  type examenValues,
  type categoriasValues,
  type claseValues
} from '../../../shared/Interfaces'

interface InterfaceImage {
  file: File | null
  preview: string | ArrayBuffer | null | undefined
}

export const CrearExamenEntrada = (): JSX.Element => {
  const navigate = useNavigate()
  const { setTitle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [preguntaActiva, setPreguntaActiva] = useState<number | null>(1)
  const [imagenGrande, setImagenGrande] = useState<string | null>(null)
  const [profesores, setProfesores] = useState([])
  const token = localStorage.getItem('token')
  const [open, setOpen] = useState(false)
  const [preguntas, setPreguntas] = useState<
  Array<{
    id: string
    pregunta: string
    idClase: string
    respuestas: Array<{
      texto: string
      esCorrecta: boolean
      imagen: InterfaceImage | null
    }>
    imagen: InterfaceImage | null
  }>
  >([
    {
      id: '',
      pregunta: '',
      idClase: '',
      respuestas: [
        { texto: '', esCorrecta: true, imagen: { file: null, preview: null } }
      ],
      imagen: { file: null, preview: null } // Objeto que coincide con la interfaz InterfaceImage
    }
  ])

  const togglePreguntaActiva = (indexPregunta: number): void => {
    if (preguntaActiva == indexPregunta) {
      setPreguntaActiva(null) // Cierra la pregunta si ya está abierta
    } else {
      setPreguntaActiva(indexPregunta) // Abre la pregunta seleccionada
    }
  }

  const getCursos = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getProductos`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setProfesores(request.data)
  }

  const saveExamen = async (): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('titulo', values.nombre)
    data.append('id_curso', values.id_profesor)
    data.append('estado', '1')
    data.append('arraydatos', JSON.stringify(preguntas))
    preguntas.forEach((pregunta, indexPregunta) => {
      if (pregunta.imagen?.file) {
        data.append(`pregunta_imagen_${indexPregunta}`, pregunta.imagen.file)
      }
      pregunta.respuestas.forEach((respuesta, indexRespuesta) => {
        if (respuesta.imagen?.file) {
          data.append(
            `respuesta_imagen_${indexPregunta}_${indexRespuesta}`,
            respuesta.imagen.file
          )
        }
      })
    })

    try {
      const respuesta = await axios.post(`${Global.url}/saveExamen`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })

      if (respuesta.data.status == 'success') {
        Swal.fire('Agregado correctamente', '', 'success')
        navigate('/admin/examenesdeentrada')
      } else {
        Swal.fire('Error ', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
    setLoading(false)
  }

  const agregarPregunta = (): void => {
    const nuevoId = uuidv4()
    setPreguntas([
      ...preguntas,
      {
        id: nuevoId,
        pregunta: '',
        idClase: '',
        respuestas: [
          {
            texto: '',
            esCorrecta: true,
            imagen: { file: null, preview: null }
          }
        ],
        imagen: null
      }
    ])
  }

  const agregarRespuesta = (indexPregunta: number): void => {
    const nuevasPreguntas = [...preguntas]
    nuevasPreguntas[indexPregunta].respuestas.push({
      texto: '',
      esCorrecta: false,
      imagen: { file: null, preview: null }
    })
    setPreguntas(nuevasPreguntas)
  }

  const handlePreguntaChange = (e: any, indexPregunta: number): void => {
    const nuevasPreguntas = [...preguntas]
    nuevasPreguntas[indexPregunta].pregunta = e.target.value
    setPreguntas(nuevasPreguntas)
  }

  const handleRespuestaChange = (
    e: any,
    indexPregunta: number,
    indexRespuesta: number
  ): void => {
    const nuevasPreguntas = [...preguntas]
    nuevasPreguntas[indexPregunta].respuestas[indexRespuesta].texto =
      e.target.value
    setPreguntas(nuevasPreguntas)
  }

  const handleRespuestaCorrecta = (
    indexPregunta: number,
    indexRespuesta: number
  ): void => {
    const nuevasPreguntas = [...preguntas]
    nuevasPreguntas[indexPregunta].respuestas.forEach((respuesta, i) => {
      respuesta.esCorrecta = i === indexRespuesta
    })
    setPreguntas(nuevasPreguntas)
  }

  const eliminarRespuesta = (
    indexPregunta: number,
    indexRespuesta: number
  ): void => {
    const nuevasPreguntas = [...preguntas]
    nuevasPreguntas[indexPregunta].respuestas.splice(indexRespuesta, 1)
    setPreguntas(nuevasPreguntas)
  }

  useEffect(() => {
    getCursos()
    setTitle('Registrar Examen de entrada')
  }, [])

  const { handleSubmit, handleChange, errors, values, touched, handleBlur } =
    useFormik({
      initialValues: {
        nombre: '',
        id_profesor: ''
      },
      validationSchema: SchemaMarcas,
      onSubmit: saveExamen
    })

  const handleImagenChange = (e: any, indexPregunta: number): void => {
    const file = e.target.files[0]
    if (file?.type.match('image.*')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const nuevasPreguntas = [...preguntas]
        nuevasPreguntas[indexPregunta].imagen = {
          file,
          preview: e.target?.result
        }
        setPreguntas(nuevasPreguntas)
      }
      reader.readAsDataURL(file)
    }
  }

  const eliminarImagen = (indexPregunta: number): void => {
    const nuevasPreguntas = [...preguntas]
    nuevasPreguntas[indexPregunta].imagen = { file: null, preview: null }
    setPreguntas(nuevasPreguntas)
  }

  const handleRespuestaImagenChange = (
    e: any,
    indexPregunta: number,
    indexRespuesta: number
  ): void => {
    const file = e.target.files[0]
    if (file?.type.match('image.*')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const nuevasPreguntas = [...preguntas]
        let imagenObj =
          nuevasPreguntas[indexPregunta].respuestas[indexRespuesta].imagen
        if (!imagenObj) {
          imagenObj = { file: null, preview: null }
          nuevasPreguntas[indexPregunta].respuestas[indexRespuesta].imagen =
            imagenObj
        }
        // Ahora puedes asignar con seguridad las propiedades 'file' y 'preview'
        imagenObj.file = file
        imagenObj.preview = e.target?.result
        setPreguntas(nuevasPreguntas)
      }
      reader.readAsDataURL(file)
    }
  }

  const eliminarRespuestaImagen = (
    indexPregunta: number,
    indexRespuesta: number
  ): void => {
    const nuevasPreguntas = [...preguntas]
    nuevasPreguntas[indexPregunta].respuestas[indexRespuesta].imagen = {
      file: null,
      preview: null
    }
    setPreguntas(nuevasPreguntas)
  }

  const handleClaseChange = (e: React.ChangeEvent<HTMLSelectElement>, indexPregunta: number): void => {
    const nuevasPreguntas = [...preguntas]
    nuevasPreguntas[indexPregunta].idClase = e.target.value
    setPreguntas(nuevasPreguntas)
  }

  return (
    <>
      {loading
        ? <Loading />
        : (
        <form
          className="bg-secondary-100 p-8 rounded-xl"
          onSubmit={handleSubmit}
        >
          <div className="flex gap-4">
            <div className="w-full lg:relative mb-5">
              <TitleBriefs titulo="Titulo de exámen" />
              <InputsBriefs
                name="nombre"
                type="text"
                value={values.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.nombre} touched={touched.nombre} />
            </div>
            <div className="w-full md:w-1/3 mb-6">
              <TitleBriefs titulo="Asignar curso" />
              <select
                className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                name="id_profesor"
                value={values.id_profesor}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Seleccionar</option>
                {profesores.map((profesor: categoriasValues) => (
                  <option value={profesor.id} key={profesor.id}>
                    {profesor.nombre}
                  </option>
                ))}
              </select>
              <Errors
                errors={errors.id_profesor}
                touched={touched.id_profesor}
              />
            </div>
          </div>

          {values.id_profesor && (
            <>
              <h2 className="mb-6 text-2xl font-bold uppercase">
                Registro de preguntas y respuestas
              </h2>

              <div className="w-full flex items-end flex-col">
                <button
                  className="p-3 bg-blue-600 w-fit font-bold text-white rounded-xl"
                  type="button" // Importante para evitar que envíe el formulario
                  onClick={agregarPregunta}
                >
                  Agregar Pregunta
                </button>
                {preguntas.map((pregunta, indexPregunta) => (
                  <div key={indexPregunta} className="w-full flex flex-col">
                    <TitleBriefs titulo="Pregunta y asignacion de seccion" />
                    <div className="flex gap-3 items-center w-full">
                      <div className="relative w-full">
                        <div className="flex gap-6">
                          <select
                            className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-1/3 pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                            name="id_profesor"
                            autoComplete="off"
                            value={pregunta.idClase}
                            onChange={(e) => { handleClaseChange(e, indexPregunta) }
                            }
                          >
                            <option
                            >
                              Seleccionar
                            </option>
                            {profesores
                              .filter(
                                (examen: examenValues) =>
                                  String(examen.id) == values.id_profesor
                              )
                              .map((profesor: examenValues) =>
                                JSON.parse(profesor.contenido).map(
                                  (clase: claseValues, index: number) => (
                                    <option value={clase.id} key={index}>
                                      {clase.titulo}
                                    </option>
                                  )
                                )
                              )}
                          </select>
                          <input
                            type="text"
                            className="border  border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full p-4 pr-28 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                            value={pregunta.pregunta}
                            onChange={(e) => {
                              handlePreguntaChange(e, indexPregunta)
                            }}
                          />
                        </div>
                        <div className="absolute right-2 top-0 bottom-0 flex h-full items-center">
                          {pregunta.imagen?.preview
                            ? (
                            <div className="flex gap-0 items-center justify-center h-full">
                              <button
                                onClick={() => {
                                  eliminarImagen(indexPregunta)
                                }}
                                className="mt-2 text-red-500 text-2xl"
                              >
                                <TiDelete />
                              </button>
                              <div
                                className="cursor-pointer h-full flex items-center"
                                onClick={() => {
                                  setOpen(true)
                                  setImagenGrande(
                                    pregunta.imagen?.preview as string
                                  )
                                }}
                              >
                                <img
                                  src={pregunta.imagen.preview as string}
                                  alt="Vista previa"
                                  className="w-20 h-[80%] mt-2 object-contain"
                                />
                              </div>
                            </div>
                              )
                            : (
                            <>
                              <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 file:hidden cursor-pointer opacity-0"
                                onChange={(e) => {
                                  handleImagenChange(e, indexPregunta)
                                }}
                              />
                              <FaImage className="text-6xl my-auto mt-2" />
                            </>
                              )}
                        </div>
                      </div>

                      <FaChevronCircleUp
                        onClick={() => {
                          togglePreguntaActiva(indexPregunta)
                        }}
                        className={`text-3xl mt-2 ${
                          preguntaActiva == indexPregunta ? '' : 'rotate-180'
                        }`}
                      />
                    </div>

                    <div className="mb-10">
                      <AnimatePresence>
                        {preguntaActiva == indexPregunta && (
                          <>
                            <motion.section
                              key="content"
                              initial={{
                                opacity: 0,
                                maxHeight: 0,
                                padding: 0,
                                marginTop: '0'
                              }}
                              animate={{
                                opacity: 1,
                                maxHeight: 500,
                                padding: '24px',
                                marginTop: '24px'
                              }} // 500 es un valor ejemplo, ajusta según sea necesario
                              exit={{
                                opacity: 0,
                                maxHeight: 0,
                                padding: 0,
                                marginTop: '0'
                              }}
                              transition={{
                                opacity: { duration: 0.2 },
                                maxHeight: { duration: 0.5, type: 'spring' }
                              }}
                              className="mt-6 mx-10 px-4 py-6 flex gap-4 flex-col overflow-hidden"
                            >
                              {pregunta.respuestas.map(
                                (respuesta, indexRespuesta) => (
                                  <div key={indexRespuesta} className="">
                                    <TitleBriefs
                                      titulo={`Respuesta ${indexRespuesta + 1}`}
                                    />
                                    <div className="flex gap-6 items-center">
                                      <div className="w-full relative">
                                        <input
                                          className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                              focus:border-black w-full p-4 text-base block bg-secondary-900
                                                rounded-md transition-all"
                                          type="text"
                                          value={respuesta.texto}
                                          onChange={(e) => {
                                            handleRespuestaChange(
                                              e,
                                              indexPregunta,
                                              indexRespuesta
                                            )
                                          }}
                                        />
                                        <div className="absolute right-2 top-0 bottom-0 flex h-full items-center">
                                          {respuesta.imagen?.preview
                                            ? (
                                            <div className="flex gap-0 items-center justify-center h-full">
                                              <button
                                                onClick={() => {
                                                  eliminarRespuestaImagen(
                                                    indexPregunta,
                                                    indexRespuesta
                                                  )
                                                }}
                                                className="text-red-500 text-2xl"
                                              >
                                                <TiDelete />
                                              </button>
                                              <div
                                                className="flex items-center cursor-pointer w-full h-full"
                                                onClick={() => {
                                                  setOpen(true)
                                                  setImagenGrande(
                                                    pregunta.imagen
                                                      ?.preview as string
                                                  )
                                                }}
                                              >
                                                <img
                                                  src={
                                                    respuesta.imagen
                                                      .preview as string
                                                  }
                                                  alt="Vista previa"
                                                  className="w-20 h-[80%] object-contain"
                                                />
                                              </div>
                                            </div>
                                              )
                                            : (
                                            <>
                                              <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 file:hidden cursor-pointer opacity-0"
                                                onChange={(e) => {
                                                  handleRespuestaImagenChange(
                                                    e,
                                                    indexPregunta,
                                                    indexRespuesta
                                                  )
                                                }}
                                              />
                                              <FaImage className="text-6xl my-auto " />
                                            </>
                                              )}
                                        </div>
                                      </div>
                                      <input
                                        type="radio"
                                        className="w-6 h-6 cursor-pointer "
                                        checked={respuesta.esCorrecta}
                                        onChange={() => {
                                          handleRespuestaCorrecta(
                                            indexPregunta,
                                            indexRespuesta
                                          )
                                        }}
                                      />
                                      <MdDeleteForever
                                        className="text-3xl text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                        onClick={() => {
                                          eliminarRespuesta(
                                            indexPregunta,
                                            indexRespuesta
                                          )
                                        }}
                                      />
                                    </div>
                                  </div>
                                )
                              )}
                              <button
                                className="p-3 mt-4 bg-green-600 w-fit mx-auto font-bold text-black"
                                type="button"
                                onClick={() => {
                                  agregarRespuesta(indexPregunta)
                                }}
                              >
                                Agregar Respuesta
                              </button>
                            </motion.section>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="flex gap-2 w-full justify-end">
            <input type="hidden" name="oculto" value="1" />
            <Link
              to="/admin/examenesdeentrada"
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
      <ViewImage open={open} setOpen={setOpen} imagen={imagenGrande} />
    </>
  )
}