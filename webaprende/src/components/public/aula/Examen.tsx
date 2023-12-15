import { useEffect, useState } from 'react'
import person from './../../../assets/examen/person.svg'
import useAuth from '../../../hooks/useAuth'
import { Global } from '../../../helper/Global'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Loading from '../../shared/Loading'
import {
  type valuesExamenesEntrada,
  type valuesExamen
} from '../../shared/Interfaces'
import { ExamenEntrada } from './examendeentrada/ExamenEntrada'
import Swal from 'sweetalert2'

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

    const request3 = await axios.get(`${Global.url}/perfilEstudiante`, {
      headers: {
        Authorization: `Bearer ${token ?? ''}`
      }
    })
    const examenEntradaArray = request3.data.user.examenentrada
      ? JSON.parse(request3.data.user.examenentrada)
      : []
    setAllExamenes(examenEntradaArray)
    const contieneId = examenEntradaArray.some(
      (objeto: valuesExamenesEntrada) => objeto.id == id
    )
    const codClase: string = request.data.contenido[0].clase[0].id
    if (contieneId) {
      navigate(`/cursos/curso/${id ?? ''}/clases/clase/${codClase ?? ''}`)
    }
    setExamen(request2.data)
    setLoadingComponent(false)
  }

  useEffect(() => {
    if (!loading && token) {
      getCurso()
    }
  }, [loading])

  const enviarDatos = async (): Promise<void> => {
    const arregloConTodoVacio = [
      {
        id,
        contenido: '',
        nota: null,
        aciertos: null,
        totalPreguntas: null
      }
    ]

    const data = new FormData()
    data.append('examenentrada', JSON.stringify(arregloConTodoVacio))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/saveExamenEntrada/${auth.id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )

      if (respuesta.data.status === 'success') {
        Swal.fire('Se omitio el exámen', '', 'success')
        window.location.reload()
      } else {
        Swal.fire('Error al guardar', '', 'error')
      }
    } catch (error: unknown) {
      console.log(error)
      Swal.fire('Error al guardar', '', 'error')
    }
  }

  const handleNextQuestion = (): void => {
    Swal.fire({
      title: '<strong><u>¿Deseas omitir el exámen?</u></strong>',
      icon: 'info',
      html: `
        <b>No podras tomar este exámen más adelante</b>
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
    }).then((result: any) => {
      if (result.isConfirmed) {
        enviarDatos()
      }
    })
  }

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
            <h1 className="text-gray-300 text-4xl text-center pt-[120px]">
              Bienvenido {auth.onlyname}, queremos asegurarnos de que tengas la
              mejor experiencia de aprendizaje posible. Hemos preparado un breve
              examen para evaluar tus conocimientos actuales, pero queremos que
              sepas que este examen es completamente opcional.
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
            <p
              className="text-2xl text-gray-300 transition-colors hover:text-white underline cursor-pointer"
              onClick={() => {
                handleNextQuestion()
              }}
            >
              Omitir examen
            </p>
          </div>
        </section>
          : estado === 1 && (
          <ExamenEntrada
            examen={examen}
            setLoadingComponent={setLoadingComponent}
            id={id}
            setAllExamenes={setAllExamenes}
          />
          )
      }
    </>
  )
}

export default Examen
