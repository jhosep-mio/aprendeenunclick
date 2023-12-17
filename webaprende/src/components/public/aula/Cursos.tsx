import { useEffect, useState } from 'react'
import TabsCursos from './cursosComponents/Tabs'
import CardGeneral from './perfilComponents/CardGeneral'
import Loading from '../../shared/Loading'
import { type productosValues, type valuesExamenesEntrada } from '../../shared/Interfaces'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import useAuth from '../../../hooks/useAuth'

const Cursos = (): JSX.Element => {
  const [loadingComponent, setLoadingComponent] = useState(true)
  const token = localStorage.getItem('tokenUser')
  const { auth } = useAuth()
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

  const getcursosToCompra = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/cursesToCompras2/${auth.id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    if (request.data && JSON.parse(request.data.array_productos)[0]) {
      const transaccion = JSON.parse(request.data.array_productos)[0]
      if (transaccion) {
        getCursos()
      }
    } else {
      setLoadingComponent(false)
    }
  }

  useEffect(() => {
    if (auth.id) {
      getValidacion()
      getcursosToCompra()
    }
  }, [auth.id])

  return (
    <>
      {loadingComponent && <Loading/>}
        <section className="cursos min-h-screen">
            <div className="cursos__main">
                <div className="cursos__main__title">
                    <h2>Mis cursos</h2>
                </div>
                <div className="cursos__main__tabs">
                    <TabsCursos cursos={cursos} examenes={examenes}/>
                </div>
            </div>
            <div className="cursos__perfil">
                <CardGeneral/>
            </div>
        </section>
    </>
  )
}

export default Cursos
