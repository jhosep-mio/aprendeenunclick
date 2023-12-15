import { type Dispatch, Fragment, type SetStateAction, useState } from 'react'
import {
  type valuesPreguntas,
  type valuesExamen
} from '../../../shared/Interfaces'
import { HiChevronRight } from 'react-icons/hi'
import { Global } from '../../../../helper/Global'
import { ViewImage } from './ViewImage'
import Swal from 'sweetalert2'
import axios from 'axios'
import useAuth from '../../../../hooks/useAuth'

interface valuesExamenes {
  id: string | undefined
  contenido: any
}

export const ExamenNormal = ({
  examen,
  setLoadingComponent,
  id
}: {
  examen: valuesExamen | null
  setLoadingComponent: Dispatch<SetStateAction<boolean>>
  id: string | undefined
}): JSX.Element => {
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const { auth, token } = useAuth()
  const [verImagen, setVerImagen] = useState<
  string | ArrayBuffer | null | undefined
  >('')
  const [open, setOpen] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<
  Record<number, string>
  >({})
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false)
  const [, setAllExamenes] = useState<valuesExamenes[]>([])
  const renderLetter = (index: number): string =>
    String.fromCharCode(65 + index)

  const checkAllQuestionsAnswered = (
    updatedAnswers: Record<number, string>
  ): void => {
    const allAnswered =
      Object.keys(updatedAnswers).length == JSON.parse(examen?.arraydatos ?? '').length
    setAllQuestionsAnswered(allAnswered)
  }

  const handleAnswerSelection = (answerIndex: number): void => {
    const updatedAnswers = {
      ...selectedAnswers,
      [currentQuestion]: String.fromCharCode(65 + answerIndex)
    }

    setSelectedAnswers(updatedAnswers)
    checkAllQuestionsAnswered(updatedAnswers)
  }

  const handleNextQuestion = (): void => {
    console.log(currentQuestion)
    if (selectedAnswers[currentQuestion] !== undefined) {
      Swal.fire({
        title: '<strong><u>¿Desea continuar?</u></strong>',
        icon: 'info',
        html: `
        <b>No podra cambiar su respuesta</b>
  `,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: `
              <i class="fa fa-thumbs-up"></i> SI!
            `,
        confirmButtonAriaLabel: 'No podra modificar su respuesta!',
        cancelButtonText: `
              <i class="fa fa-thumbs-down"></i> NO
            `,
        cancelButtonAriaLabel: 'Thumbs down'
      }).then((result) => {
        if (result.isConfirmed) {
          setCurrentQuestion((prev) => prev + 1)
        }
      })
    } else {
      Swal.fire('Por favor seleccione una respuesta', '', 'warning')
    }
  }

  const mostrarResultados = (): void => {
    agregarApunte()
  }

  const calcularCalificacion2 = (
    selectedAnswers: any
  ): { calificacion: number, aciertos: number, totalPreguntas: number } => {
    const totalPreguntas = JSON.parse(examen?.arraydatos ?? '').length
    let aciertos = 0
    JSON.parse(examen?.arraydatos ?? '').forEach(
      (exa: valuesPreguntas, index: number) => {
        exa.respuestas.forEach((respuesta, respuestaIndex: number) => {
          if (
            respuesta.esCorrecta &&
              renderLetter(respuestaIndex) == selectedAnswers[index + 1]
          ) {
            aciertos++
          }
        })
      }
    )
    const calificacion = (aciertos / totalPreguntas) * 10
    return { calificacion, aciertos, totalPreguntas }
  }

  const agregarApunte = async (): Promise<void> => {
    setLoadingComponent(true)
    const { calificacion, aciertos, totalPreguntas } = calcularCalificacion2(selectedAnswers)
    const nuevoResumen = {
      id,
      contenido: selectedAnswers,
      nota: calificacion,
      aciertos,
      totalPreguntas
    }
    setAllExamenes(
      (resumenesPrevios: valuesExamenes[] | undefined): valuesExamenes[] => {
        const prevResumenes = Array.isArray(resumenesPrevios)
          ? resumenesPrevios
          : []
        let examenReemplazado = false
        const nuevosResumenes = prevResumenes.map((exam) => {
          if (exam.id === id) {
            // If it exists, update the existing exam
            examenReemplazado = true
            return nuevoResumen
          }
          return exam
        })
        if (!examenReemplazado) {
          nuevosResumenes.push(nuevoResumen)
        }
        const enviarDatos = async (): Promise<void> => {
          const data = new FormData()
          data.append('listaexamen', JSON.stringify(nuevosResumenes))
          data.append('_method', 'PUT')
          try {
            const respuesta = await axios.post(
                    `${Global.url}/saveExamen/${auth.id ?? ''}`,
                    data,
                    {
                      headers: {
                        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
                      }
                    }
            )

            if (respuesta.data.status === 'success') {
              Swal.fire('Examen enviado', '', 'success')
              window.location.reload()
            } else {
              Swal.fire('Error al guardar', '', 'error')
            }
          } catch (error: unknown) {
            console.log(error)
            Swal.fire('Error al guardar', '', 'error')
          }
        }
        enviarDatos()
        return nuevosResumenes
      }
    )
    setLoadingComponent(false)
  }

  return (
    <section className="examen fixed inset-0">
      {JSON.parse(examen?.arraydatos ?? '').map(
        (exa: valuesPreguntas, index: number) =>
          index + 1 == currentQuestion && (
            <Fragment key={index}>
              <div className="examen__main mx-auto mb-6 lg:w-[80%] 2xl:w-[60%]">
                <div className="relative">
                  <div className="relative">
                    <div className="w-full h-2 bg-gray-300 rounded-xl before:bg-primary " />
                    <div
                      className=" h-2 bg-primary rounded-xl absolute inset-0"
                      style={{
                        width: `${(index / JSON.parse(examen?.arraydatos ?? '').length) * 100}%`
                      }}
                    />
                  </div>
                  {currentQuestion >= 0 && (
                    <span className=" text-[1.7rem] text-gray-400 w-full text-right block mt-2">
                      Pregunta {currentQuestion } de{' '}
                      {JSON.parse(examen?.arraydatos ?? '').length}
                    </span>
                  )}
                </div>
                <section className="w-full overflow-y-auto my-6 px-4 scroll_style">
                  <div className="examen__main__pregunta">
                    <h3>
                      {currentQuestion}. {exa.pregunta}
                    </h3>
                  </div>
                  {exa.imagen?.preview && (
                    <img
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
                      src={`${Global.urlImages}/examenes/${exa.imagen.preview}`}
                      className="w-full mx-auto max-h-[300px] object-contain mb-16 cursor-pointer"
                      onClick={() => {
                        setOpen(true)
                        setVerImagen(
                          // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                          exa.imagen?.preview ?? ''
                        )
                      }}
                      alt=""
                    />
                  )}
                  <div className="examen__main__opciones ">
                    {exa.respuestas.map((respuesta, respuestaIndex: number) => (
                      <div
                        key={respuestaIndex}
                        onClick={() => {
                          handleAnswerSelection(respuestaIndex)
                        }}
                        className={
                          selectedAnswers[currentQuestion] ==
                          renderLetter(respuestaIndex)
                            ? 'radio-input99 radio-input'
                            : 'radio-input'
                        }
                      >
                        <div className="info relative">
                          <input
                            type="radio"
                            id="value-1"
                            name="value-radio"
                            value="value-1"
                          />
                          <label>
                            {renderLetter(respuestaIndex).toLocaleLowerCase()}){' '}
                            {respuesta.texto}
                          </label>
                          {respuesta.imagen?.preview && (
                            <img
                              src={`${Global.urlImages}/examenes/${
                                // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                                respuesta.imagen?.preview ?? ''
                              }`}
                              alt=""
                              className="h-full w-40 absolute right-0 object-cover object-right cursor-pointer"
                              onClick={() => {
                                setOpen(true)
                                setVerImagen(
                                  // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                                  respuesta.imagen?.preview ?? ''
                                )
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <div className="flex justify-center w-full mt-6">
                  {currentQuestion < JSON.parse(examen?.arraydatos ?? '').length && (
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="flex items-center text-3xl bg-primary hover:bg-primary/80 transition-colors rounded-xl text-white px-8 py-4"
                    >
                      Siguiente
                      <HiChevronRight />
                    </button>
                  )}
                  {currentQuestion == JSON.parse(examen?.arraydatos ?? '').length && (
                    <button
                      onClick={() => {
                        mostrarResultados()
                      }}
                      disabled={!allQuestionsAnswered}
                      className={`${
                        !allQuestionsAnswered ? 'bg-primary/70' : 'bg-primary'
                      } flex items-center text-3xl  hover:bg-primary/80 transition-colors rounded-xl text-white px-8 py-4`}
                    >
                      Terminar Examen
                    </button>
                  )}
                </div>
              </div>
            </Fragment>
          )
      )}
      <ViewImage open={open} setOpen={setOpen} imagen={verImagen} />
    </section>
  )
}
