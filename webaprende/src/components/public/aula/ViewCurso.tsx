import { Link, useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import Clases from './clase/Clases'
import { useEffect, useState } from 'react'
import Loading from '../../shared/Loading'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import {
  type valuesExamenesEntrada,
  type imagenUpladvalues,
  type productosValues,
  type valuesClase,
  type valuesCurso,
  type valuesExamenResuleto,
  type comentariosValues
} from '../../shared/Interfaces'
import { formatearURL } from '../../shared/funtions'
import { YoutubeVideo } from './clase/YoutubeVideo'
import Examen from './clase/Examen'
import useAuth from '../../../hooks/useAuth'
import { Ejercicio } from './ejercicio/Ejercicio'
const ViewCurso = (): JSX.Element => {
  const { auth } = useAuth()
  const [loadingComponent, setLoadingComponent] = useState(true)
  const [clase, setClase] = useState<valuesClase | null>(null)
  const [contenido, setContenido] = useState<valuesCurso[]>([])
  const [curso, setcurso] = useState<productosValues | null>(null)
  const { id, idClase } = useParams()
  const token = localStorage.getItem('tokenUser')
  const [player, setPlayer] = useState<string | null>(null)
  const [, setTiempo] = useState('')
  const [progresoClases, setProgresoClases] = useState<
  Record<string, Record<string, boolean>>
  >({})
  const [, setProgress] = useState(0)
  const navigate = useNavigate()
  const [archivos, setArchivos] = useState<comentariosValues[]>([])
  const [validacion, setValidacion] = useState(false)
  const [examenesResuelto, setExamenesResuelto] = useState< valuesExamenResuleto | null>(null)

  const getCurso = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/indexOnlyToClase/${id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    setcurso(request.data)
    const contenido: valuesCurso[] = request.data.contenido
      ? request.data.contenido
      : []
    setContenido(contenido)
    console.log(request.data)
    if (request.data.archivos) {
      setArchivos(JSON.parse(request.data.archivos))
    }

    const requestExamen = await axios.get(`${Global.url}/perfilEstudiante`, {
      headers: {
        Authorization: `Bearer ${token ?? ''}`
      }
    })
    const examenEntradaArray = requestExamen.data.user.examenentrada ? JSON.parse(requestExamen.data.user.examenentrada) : []
    const contieneId = examenEntradaArray.some((objeto: valuesExamenesEntrada) => objeto.id == id)
    if (!contieneId) {
      navigate(`/aula/cursos/curso/${id ?? ''}/examen-entrada`)
    }
    const ordenAciertos = examenEntradaArray[0].orden
    if (ordenAciertos) {
      const contenidoOrdenado = contenido.sort((a, b) => {
        const aciertosA = ordenAciertos.find((item: any) => item.idClase === a.id)?.aciertos || 0
        const aciertosB = ordenAciertos.find((item: any) => item.idClase === b.id)?.aciertos || 0
        return aciertosB - aciertosA
      })
      console.log(contenidoOrdenado)
    }
    for (const seccion of contenido) {
      const claseEncontrada = seccion.clase.find(
        (clase: valuesClase) => clase.id == idClase
      )
      if (claseEncontrada) {
        setClase(claseEncontrada)
        getValidacion(claseEncontrada.id)
        break
      }
    }
    setLoadingComponent(false)
  }

  const getValidacion = async (id: string): Promise<void> => {
    const request = await axios.get(`${Global.url}/perfilEstudiante`, {
      headers: {
        Authorization: `Bearer ${token ?? ''}`
      }
    })
    const examenEntradaArray = request.data.user.listaexamen
      ? JSON.parse(request.data.user.listaexamen)
      : []
    setProgresoClases(JSON.parse(request.data.user.progreso))
    const examenEncontrado = examenEntradaArray.find(
      (objeto: valuesExamenesEntrada) => objeto.id == id
    )

    if (examenEncontrado) {
      setExamenesResuelto(examenEncontrado)
    }
    const contieneId = examenEntradaArray.some(
      (objeto: valuesExamenesEntrada) => objeto.id == id
    )
    setValidacion(contieneId)
  }

  const handleVideoProgress = (
    percent: number,
    formattedTime: string
  ): void => {
    setProgress(percent)
    setTiempo(formattedTime)
    if (percent >= 80) {
      let yaCompletada = false
      if (progresoClases) {
        yaCompletada = progresoClases[id ?? '']?.[clase?.id ?? '']
      }
      if (!yaCompletada) {
        actualizarProgresoClase(id, idClase)
      }
    }
  }

  const handleImageProgress = (): void => {
    // Lógica para manejar el progreso de las imágenes
    let yaVistas = false
    if (progresoClases) {
      yaVistas = progresoClases[id ?? '']?.[clase?.id ?? '']
    }
    if (!yaVistas) {
      actualizarProgresoClase(id, idClase)
    }
  }

  const actualizarProgresoClase = (
    cursoId: string | undefined,
    claseId: string | undefined
  ): void => {
    setProgresoClases((prevProgreso) => {
      const nuevoProgreso = { ...prevProgreso }
      nuevoProgreso[cursoId ?? ''] = nuevoProgreso[cursoId ?? ''] || {}
      nuevoProgreso[cursoId ?? ''][claseId ?? ''] = true
      const actualizarProgreso = async (): Promise<void> => {
        const data = new FormData()
        data.append('progreso', JSON.stringify(nuevoProgreso))
        data.append('_method', 'PUT')
        try {
          const resultado = await axios.post(
              `${Global.url}/saveProgreso/${auth.id ?? ''}`,
              data,
              {
                headers: {
                  Authorization: `Bearer ${
                    token !== null && token !== '' ? token : ''
                  }`
                }
              }
          )
          if (resultado.data.status == 'success') {
            getCurso()
          }
        } catch (error: unknown) {
          console.log(error)
        }
      }
      actualizarProgreso()
      return nuevoProgreso
    })
  }

  useEffect(() => {
    setLoadingComponent(true)
    getCurso()
  }, [id, idClase])

  return (
    <>
      {loadingComponent
        ? <Loading />
        : (
        <main className="flex flex-col xl:flex-row bg-[#353573] min-h-screen">
          {clase?.tipo == 'Examen' && !validacion
            ? <div className="flex flex-col w-full h-screen relative before:absolute before:bg-no-repeat before:bg-cover before:w-full before:h-full fondo_examen before:opacity-90 before:-z-[1] z-[1]">
              <div className="flex gap-8 items-center h-fit p-8">
                <Link to="" type="button">
                  <img
                    src={`${Global.urlImages}/productos/${curso?.imagen ?? ''}`}
                    alt=""
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </Link>
                <div className="flex flex-col">
                  <h2 className="text-white text-5xl mb-2">
                    <strong>{curso?.nombre}</strong>
                  </h2>
                  <div className="flex gap-2 text-xl text-gray-300">
                    <Link
                      to="/aula/cursos"
                      className="transition-colors hover:text-white"
                    >
                      Mis cursos
                    </Link>{' '}
                    /
                    <Link
                      className="transition-colors hover:text-white"
                      to={`/aula/cursos/curso/${curso?.id ?? ''}-${formatearURL(
                        curso?.nombre ?? ''
                      )}`}
                    >
                      {curso?.nombre}
                    </Link>{' '}
                    /<p>{clase?.titulo}</p>
                  </div>
                </div>
              </div>
              <div className="w-full h-full">
                <Examen idCurso={id } clase={clase} setValidacion={setValidacion} validacion={validacion} examenesResuelto={examenesResuelto} actualizarProgresoClase={actualizarProgresoClase}/>
              </div>
            </div>
            : (
            <>
              <div className="w-full xl:w-[75%] bg-paleta-900 px-10 md:px-20 lg:px-32 py-10 flex flex-col gap-8 ">
                <div className="flex gap-8 items-center h-fit">
                  <Link to="" type="button">
                    <img
                      src={`${Global.urlImages}/productos/${
                        curso?.imagen ?? ''
                      }`}
                      alt=""
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <h2 className="text-white text-5xl mb-2">
                      <strong>{curso?.nombre}</strong>
                    </h2>
                    <div className="flex gap-2 text-xl text-gray-300">
                      <Link
                        to="/aula/cursos"
                        className="transition-colors hover:text-white"
                      >
                        Mis cursos
                      </Link>{' '}
                      /
                      <Link
                        className="transition-colors hover:text-white"
                        to={`/aula/cursos/curso/${
                          curso?.id ?? ''
                        }-${formatearURL(curso?.nombre ?? '')}`}
                      >
                        {curso?.nombre}
                      </Link>{' '}
                      /<p>{clase?.titulo}</p>
                    </div>
                  </div>
                </div>
                {clase?.tipo == 'Imagen' && (
                  <div className="flex flex-col">
                    <Swiper
                      className="w-full rounded-3xl overflow-hidden"
                      loop={true}
                      onSlideChange={(swiper) => {
                        const percent = (swiper.activeIndex + 1) / clase?.contenido.length * 100
                        if (percent >= 99) {
                          handleImageProgress()
                        }
                      }}
                    >
                      {Array.isArray(clase?.contenido) &&
                        clase?.contenido.map(
                          (conten: imagenUpladvalues, index: number) => (
                            <SwiperSlide key={index}>
                              <img
                                src={`${Global.urlImages}/recurses/${conten.filename}`}
                                alt=""
                                className="h-[600px] w-full object-cover"
                              />
                            </SwiperSlide>
                          )
                        )}
                    </Swiper>
                  </div>
                )}
                {clase?.tipo == 'Clase' || clase?.tipo == 'Video'
                  ? (
                  <div className="flex flex-col">
                    <div className="w-full h-[600px]">
                      <YoutubeVideo
                        player={player}
                        setPlayer={setPlayer}
                        key={clase?.id}
                        videoId={clase?.contenido}
                        onVideoProgress={handleVideoProgress}
                      />
                    </div>
                  </div>
                    )
                  : null}
                {clase?.tipo == 'Examen' && (
                    <Examen clase={clase} idCurso={id } setValidacion={setValidacion} validacion={validacion} examenesResuelto={examenesResuelto} actualizarProgresoClase={actualizarProgresoClase} />
                )}
                {clase?.tipo != 'Examen' &&
                <div className="flex justify-between py-12">
                  <h3 className="text-4xl sm:text-5xl text-white font-semibold lowercase first-letter:uppercase">
                    {clase?.titulo}
                  </h3>
                  {/* <CantidadClases/> */}
                  {/* <span className="text-[#f1f1f1] text-2xl">04 / 12</span> */}
                </div>
                }
                {clase?.tipo == 'Ejercicio' && (
                 <>
                  <div className="flex flex-col">
                    <Swiper
                      className="w-full rounded-3xl overflow-hidden"
                      loop={true}
                      onSlideChange={(swiper) => {
                        const percent = (swiper.activeIndex + 1) / clase?.contenido.length * 100
                        if (percent >= 99) {
                          handleImageProgress()
                        }
                      }}
                    >
                      {Array.isArray(clase?.contenido) &&
                        clase?.contenido.map(
                          (conten: imagenUpladvalues, index: number) => (
                            <SwiperSlide key={index}>
                              <img
                                src={`${Global.urlImages}/recurses/${conten.filename}`}
                                alt=""
                                className="h-[600px] w-full object-cover"
                              />
                            </SwiperSlide>
                          )
                        )}
                    </Swiper>
                  </div>
                  <Ejercicio claseId={idClase} cursoId={id} archivos={archivos} getApuntes={getCurso} setArchivos={setArchivos} setProgresoClases={actualizarProgresoClase}/>
                 </>
                )}
              </div>
              <div className="w-full xl:w-[25%] p-10 py-10">
                <div className="flex flex-col mb-4 pb-10">
                  <h5 className="text-white text-3xl font-semibold">
                    Material de aprendizaje
                  </h5>
                  <p className="text-white text-2xl">Secciones del curso</p>
                </div>
                <div className="flex flex-col">
                  <Clases
                    contenido={contenido}
                    idClase={idClase}
                    progreso={progresoClases}
                    curso={id ?? ''}
                  />
                </div>
              </div>
            </>
              )}
        </main>
          )}
    </>
  )
}

export default ViewCurso
