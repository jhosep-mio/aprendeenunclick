import { Link, useParams } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { useEffect, useState } from 'react'
import {
  type valuesExamenesEntrada,
  type productosValues
} from '../../shared/Interfaces'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import Loading from '../../shared/Loading'
const Curso = (): JSX.Element => {
  const { id } = useParams()
  const { token, loading } = useAuth()
  const [curso, setCurso] = useState<productosValues | null>(null)
  const [loadingComponent, setLoadingComponent] = useState(true)
  const [validacion, setValidacion] = useState(false)
  const [codClase, setCodClase] = useState('')

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
    setCurso(request.data)
    setCodClase(request.data.contenido[0].clase[0].id)
    setLoadingComponent(false)
  }

  const getValidacion = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/perfilEstudiante`, {
      headers: {
        Authorization: `Bearer ${token ?? ''}`
      }
    })
    const examenEntradaArray = request.data.user.examenentrada
      ? JSON.parse(request.data.user.examenentrada)
      : []
    const contieneId = examenEntradaArray.some(
      (objeto: valuesExamenesEntrada) => objeto.id == id
    )
    setValidacion(contieneId)
  }

  useEffect(() => {
    if (!loading && token) {
      getValidacion()
      getCurso()
    }
  }, [loading])

  return (
    <>
      {!loadingComponent && curso
        ? (
        <section className="viewCurso">
          <div className="viewCurso__main">
            <div className="viewCurso__main__item">
              <h2>{curso.nombre}</h2>
              <div
                className=""
                dangerouslySetInnerHTML={{
                  __html: curso.caracteristicas
                }}
              ></div>
              {!validacion
                ? (
                <Link to="examen-entrada" className="btn2 mt-12">
                  Empezar curso
                </Link>
                  )
                : (
                <Link to={`/cursos/curso/${id ?? ''}/clases/clase/${codClase}`} className="btn2 mt-12">
                  Continuar curso
                </Link>
                  )}
            </div>
            <div className="viewCurso__main__item">
              <img
                src={`${Global.urlImages}/productos/${curso.imagen}`}
                alt=""
              />
            </div>
          </div>
        </section>
          )
        : (
        <Loading />
          )}
    </>
  )
}

export default Curso
