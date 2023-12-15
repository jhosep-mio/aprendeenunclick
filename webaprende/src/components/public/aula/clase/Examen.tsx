import { useEffect, useState } from 'react'
import person from './../../../../assets/examen/person.svg'
import Loading from '../../../shared/Loading'
import useAuth from '../../../../hooks/useAuth'
import {
  type valuesExamenOnly,
  type valuesClase,
  type valuesExamenResuleto,
  type valuesPreguntas
} from '../../../shared/Interfaces'
import { ExamenNormal } from '../examendeentrada/ExamenNormal'
import { Global } from '../../../../helper/Global'
import axios from 'axios'

const Examen = ({
  clase,
  validacion,
  examenesResuelto
}: {
  clase: valuesClase | null
  validacion: boolean
  examenesResuelto: valuesExamenResuleto | null
}): JSX.Element => {
  const [estado, setEstado] = useState<number>(0)
  const { token } = useAuth()
  const [loadingComponent, setLoadingComponent] = useState(true)
  const [examen, setExamen] = useState<valuesExamenOnly | null>(null)

  const getExamen = async (): Promise<void> => {
    setLoadingComponent(true)
    const request = await axios.get(
      `${Global.url}/getExamenToEstudiante/${clase?.contenido ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      }
    )
    setExamen(request.data)
    setLoadingComponent(false)
  }

  const renderLetter = (index: number): string =>
    String.fromCharCode(65 + index)

  useEffect(() => {
    if (clase?.contenido) {
      getExamen()
    }
  }, [clase])

  return (
    <>
      {loadingComponent
        ? <Loading />
        : validacion
          ? <div className="w-full justify-center flex-col my-20">
          <h2 className="uppercase text-5xl text-center text-white">
            Resultados de tu exámen
          </h2>
          <div className="my-10 bg-primary w-fit flex p-6 rounded-xl mx-auto">
            <div className="flex gap-4 flex-col justify-between items-center px-10">
              <span className="font-bold text-7xl text-white">
                {(examenesResuelto?.nota ?? 0).toFixed(1)}{' '}
              </span>
              <span className="text-3xl text-secondary-150">Calificación</span>
            </div>
            <div className="flex gap-4 flex-col justify-between items-center px-10">
              <span className="font-bold text-6xl text-white">
                {examenesResuelto?.aciertos}
                <span className="text-secondary-150">
                  /{examenesResuelto?.totalPreguntas}
                </span>
              </span>
              <span className="text-3xl text-secondary-150">Aciertos</span>
            </div>
          </div>
          <section className="lg:bg-[#353573] rounded-xl">
            <div className="w-full lg:w-[700px] lg:px-10 mx-auto py-10 ">
              {JSON.parse(examen?.arraydatos ?? '').map(
                (exa: valuesPreguntas, index: number) => (
                  <div
                    className="border-b py-10 border-secondary-10"
                    key={index}
                  >
                    <div className="flex items-center gap-4 mb-10">
                      <p className="w-full uppercase text-3xl lg:text-4xl text-left font-bold text-white">
                        {index + 1}. {exa.pregunta}
                      </p>
                    </div>
                    <ol className="flex flex-col gap-10">
                      {exa.respuestas.map(
                        (respuesta, respuestaIndex: number) =>
                          examenesResuelto?.contenido[index + 1] ==
                            renderLetter(respuestaIndex) && (
                            <>
                              <li
                                key={respuestaIndex}
                                className={`border-gray-500 border-2 px-4 py-6 text-2xl lg:text-3xl rounded-xl flex items-center relative group transition-colors pr-40 ${
                                  respuesta.esCorrecta
                                    ? 'border-green-600' // Cambia este estilo según lo que necesites para resaltar
                                    : 'border-red-600'
                                }`}
                              >
                                <span
                                  className={`flex items-center px-4 bg-gray-500 ${
                                    respuesta.esCorrecta
                                      ? 'bg-green-600' // Cambia este estilo según lo que necesites para resaltar
                                      : 'bg-red-600'
                                  }  absolute left-0 top-0 bottom-0 justify-center m-auto w-16 transition-colors text-white`}
                                >
                                  {renderLetter(respuestaIndex)}
                                </span>
                                <p className="pl-16 text-white">{respuesta.texto}</p>
                              {respuesta.imagen?.preview &&
                                <img
                                  src={`${Global.urlImages}/examenes/${
                                    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                                    respuesta.imagen?.preview ?? ''
                                  }`}
                                  alt=""
                                  className="h-full w-20 lg:w-40 absolute right-0 object-cover object-right cursor-pointer"
                                />
                              }

                              </li>
                            </>
                          )
                      )}
                    </ol>
                  </div>
                )
              )}
            </div>
          </section>
        </div>
          : estado === 0
            ? <section
          className={'h-full  '}
          //   style={{ backgroundImage: `url(${fondo})` }}
        >
          <div className="w-full h-full flex flex-col justify-center items-center max-w-[50%] mx-auto gap-10">
            <h1 className="text-white text-5xl text-center">{clase?.titulo}</h1>
            <img src={person} alt="" className="w-[500px] mt-16" />
            <button
              className="btn2 mt-12"
              onClick={() => {
                setEstado(1)
              }}
            >
              Empezar examen
            </button>
          </div>
        </section>
            : (
                estado === 1 && (
          <ExamenNormal
            examen={examen}
            setLoadingComponent={setLoadingComponent}
            id={clase?.id ?? ''}
          />
                )
              )}
    </>
  )
}

export default Examen
