import axios from 'axios'
import { Global } from '../../../../helper/Global'
import CardCurso from './CardCurso'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { type valuesExamenesEntrada, type productosValues } from '../../../shared/Interfaces'

const GridCursos = ({ setLoadingComponent }: { setLoadingComponent: Dispatch<SetStateAction<boolean>> }): JSX.Element => {
  const token = localStorage.getItem('tokenUser')
  const [cursos, setCursos] = useState<productosValues[]>([])
  const [examenes, setAllExamenes] = useState<valuesExamenesEntrada[]>([])

  const getCursos = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getProductosToAula`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setCursos(request.data)
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
    setAllExamenes(examenEntradaArray)
  }

  useEffect(() => {
    getValidacion()
    getCursos()
  }, [])

  return (
    <>
      <div className="profileCursos">
        <div className="profileCursos__main">
          {cursos.map((curso) => (
            <div className="profileCursos__main__item" key={curso.id}>
              <CardCurso curso={curso} examenes={examenes}/>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default GridCursos
