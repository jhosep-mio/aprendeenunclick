import { useEffect, useState } from 'react'
import person from './../../../assets/examen/person.svg'
import useAuth from '../../../hooks/useAuth'
import { Global } from '../../../helper/Global'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Loading from '../../shared/Loading'
import { type valuesExamenesEntrada, type valuesExamen } from '../../shared/Interfaces'
import { ExamenEntrada } from './examendeentrada/ExamenEntrada'

const Examen = (): JSX.Element => {
  const [estado, setEstado] = useState<number>(0)
  const { auth, token, loading } = useAuth()
  const [loadingComponent, setLoadingComponent] = useState(true)
  const [examen, setExamen] = useState<valuesExamen | null>(null)
  const [, setAllExamenes] = useState<valuesExamenesEntrada[]>([])
  const { id } = useParams()
  const navigate = useNavigate()

  const getCurso = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/indexOnlyToAula/${id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    const idExamen: string = request.data.examen
    const request2 = await axios.get(
      `${Global.url}/getExamenToEstudiante/${idExamen}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    setExamen(request2.data)
    setLoadingComponent(false)
  }

  const getExamenes = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/perfilEstudiante`, {
      headers: {
        Authorization: `Bearer ${token ?? ''}`
      }
    })
    const examenEntradaArray = request.data.user.examenentrada ? JSON.parse(request.data.user.examenentrada) : []
    setAllExamenes(examenEntradaArray)
    const contieneId = examenEntradaArray.some((objeto: valuesExamenesEntrada) => objeto.id == id)
    if (contieneId) {
      navigate('/aula')
    }
  }

  useEffect(() => {
    if (!loading && token) {
      getExamenes()
      getCurso()
    }
  }, [loading])

  return (
    <>
      {loadingComponent
        ? <Loading />
        : estado === 0
          ? <section
          className={
            'h-screen bg-paleta-900 relative before:absolute before:bg-no-repeat before:bg-cover before:w-full before:h-full fondo_examen before:opacity-90 before:-z-[1] z-[1]'
          }
          //   style={{ backgroundImage: `url(${fondo})` }}
        >
          <div className="w-full h-full flex flex-col justify-center items-center max-w-[50%] mx-auto gap-10">
            <h1 className="text-white text-5xl text-center">
              Bienvenido {auth.onlyname}, antes de empezar el curso necesitamos
              evaluar tus conocimientos.
            </h1>
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
          <ExamenEntrada
            examen={examen}
            setLoadingComponent={setLoadingComponent}
            id={id}
            setAllExamenes={setAllExamenes}
          />
              )
            )}
    </>
  )
}

export default Examen
