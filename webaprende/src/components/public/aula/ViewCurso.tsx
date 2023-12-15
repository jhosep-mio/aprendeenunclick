import { Link, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import Clases from './clase/Clases'
import { useEffect, useState } from 'react'
import Loading from '../../shared/Loading'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import useAuth from '../../../hooks/useAuth'
import {
  type valuesExamenesEntrada,
  type imagenUpladvalues,
  type productosValues,
  type valuesClase,
  type valuesCurso,
  type valuesExamenResuleto
} from '../../shared/Interfaces'
import { formatearURL } from '../../shared/funtions'
import { YoutubeVideo } from './clase/YoutubeVideo'
import Examen from './clase/Examen'
const ViewCurso = (): JSX.Element => {
  const [loadingComponent, setLoadingComponent] = useState(true)
  const [clase, setClase] = useState<valuesClase | null>(null)
  const [contenido, setContenido] = useState<valuesCurso[]>([])
  const [curso, setcurso] = useState<productosValues | null>(null)
  const { id, idClase } = useParams()
  const { token, loading } = useAuth()
  const [player, setPlayer] = useState<string | null>(null)
  const [, setTiempo] = useState('')
  const [progresoClases] = useState<
  Record<string, Record<string, boolean>>
  >({})
  const [, setProgress] = useState(0)

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

    const examenEncontrado = examenEntradaArray.find(
      (objeto: valuesExamenesEntrada) => objeto.id == id
    )
    console.log(id)
    if (examenEncontrado) {
      setExamenesResuelto(examenEncontrado)
    }
    const contieneId = examenEntradaArray.some(
      (objeto: valuesExamenesEntrada) => objeto.id == id
    )
    setValidacion(contieneId)
  }

  useEffect(() => {
    setLoadingComponent(true)
    if (!loading && token) {
      getCurso()
    }
  }, [loading, id, idClase])

  const handleVideoProgress = (
    percent: number,
    formattedTime: string
  ): void => {
    setProgress(percent)
    setTiempo(formattedTime)
    if (percent >= 80) {
      const yaCompletada = progresoClases[id ?? '']?.[clase?.id ?? '']
      if (!yaCompletada) {
        // actualizarProgresoClase(cursoId, claseId)
      }
    }
  }

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
                <Examen clase={clase} validacion={validacion} examenesResuelto={examenesResuelto}/>
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
                {clase?.tipo == 'Clase' && (
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
                )}
                {clase?.tipo == 'Examen' && (
                //   <div className="w-full justify-center flex-col my-20">
                //     <h2 className="uppercase text-5xl text-center text-white">
                //       Resultados de tu exámen
                //     </h2>
                //     <div className="my-10 bg-primary w-fit flex p-6 rounded-xl mx-auto">
                //       <div className="flex gap-4 flex-col justify-between items-center px-10">
                //         <span className="font-bold text-7xl text-white">
                //           {(examenesResuelto?.nota ?? 0).toFixed(1)}{' '}
                //         </span>
                //         <span className="text-3xl text-secondary-150">
                //           Calificación
                //         </span>
                //       </div>
                //       <div className="flex gap-4 flex-col justify-between items-center px-10">
                //         <span className="font-bold text-6xl text-white">
                //           {examenesResuelto?.aciertos}
                //           <span className="text-secondary-150">
                //             /{examenesResuelto?.totalPreguntas}
                //           </span>
                //         </span>
                //         <span className="text-3xl text-secondary-150">
                //           Aciertos
                //         </span>
                //       </div>
                //     </div>
                //     {/* {parseFloat(examenesResuelto.aciertos.toFixed(1)) < 6.5 && (
                //       <div className="py-6 w-full flex justify-center">
                //         <button
                //           onClick={() => {
                //             reiniciarExamen()
                //             setReiniciar(true)
                //           }}
                //           className="w-fit bg-secondary-50 py-4 px-6 rounded-lg text-3xl hover:bg-secondary-70/70 transition-all"
                //         >
                //           Reintentar
                //         </button>
                //       </div>
                //     )} */}
                //     <section className="lg:bg-[#13203E] rounded-xl">
                //       <div className="w-full lg:w-[700px] lg:px-10 mx-auto py-10 ">
                //         {JSON.parse(examen?.arraydatos ?? '').map(
                //           (exa: valuesPreguntas, index: number) => (
                //             <div
                //               className="border-b py-10 border-secondary-10"
                //               key={index}
                //             >
                //               <div className="flex items-center gap-4 mb-10">
                //                 <p className="w-full uppercase text-3xl lg:text-4xl text-left font-bold ">
                //                   {index + 1}. {exa.pregunta}
                //                 </p>
                //               </div>
                //               <ol className="flex flex-col gap-10">
                //                 {exa.respuestas.map(
                //                   (respuesta, respuestaIndex: number) =>
                //                     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //                     // @ts-expect-error
                //                     examenes?.contenido[index] ==
                //                       renderLetter(respuestaIndex) && (
                //                       <>
                //                         <li
                //                           key={respuestaIndex}
                //                           className={`border-gray-500 border-2 px-4 py-6 text-2xl lg:text-3xl rounded-xl flex items-center relative group transition-colors pr-40 ${
                //                             respuesta.esCorrecta
                //                               ? 'border-green-600' // Cambia este estilo según lo que necesites para resaltar
                //                               : 'border-red-600'
                //                           }`}
                //                         >
                //                           <span
                //                             className={`flex items-center px-4 bg-gray-500 ${
                //                               respuesta.esCorrecta
                //                                 ? 'bg-green-600' // Cambia este estilo según lo que necesites para resaltar
                //                                 : 'bg-red-600'
                //                             }  absolute left-0 top-0 bottom-0 justify-center m-auto w-16 transition-colors`}
                //                           >
                //                             {renderLetter(respuestaIndex)}
                //                           </span>
                //                           <p className="pl-16">
                //                             {respuesta.texto}
                //                           </p>
                //                           <img
                //                             src={`${
                //                               Global.urlImages
                //                             }/examenes/${
                //                               // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                //                               respuesta.imagen?.preview ?? ''
                //                             }`}
                //                             alt=""
                //                             className="h-full w-20 lg:w-40 absolute right-0 object-cover object-right cursor-pointer"
                //                             onClick={() => {
                //                               setOpen(true)
                //                               setVerImagen(
                //                                 // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                //                                 respuesta.imagen?.preview ?? ''
                //                               )
                //                             }}
                //                           />
                //                         </li>
                //                         {!respuesta.esCorrecta &&
                //                           parseFloat(calificacion.toFixed(1)) >=
                //                             6.5 && (
                //                             <span
                //                               className="text-green-600 transition-colors cursor-pointer hover:text-green-700 text-2xl underline font-bold"
                //                               onClick={() => {
                //                                 setOpenRespuesta(true)
                //                                 setRespuestaCorrecta(
                //                                   exa.respuestas
                //                                 )
                //                               }}
                //                             >
                //                               Ver respuesta correcta
                //                             </span>
                //                         )}
                //                       </>
                //                     )
                //                 )}
                //               </ol>
                //             </div>
                //           )
                //         )}
                //       </div>
                //     </section>
                //   </div>
                    <Examen clase={clase} validacion={validacion} examenesResuelto={examenesResuelto}/>
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
                    curso={`${id ?? ''}`}
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
