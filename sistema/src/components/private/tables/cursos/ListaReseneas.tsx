import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { type comentariosValues } from '../../../shared/Interfaces'
import { Global } from '../../../../helper/Global'
import { Loading } from '../../../shared/Loading'
import useAuth from '../../../../hooks/useAuth'
import { ListaRese } from './sections/ListaRese'

export const ListaReseneas = (): JSX.Element => {
  const [comentarios, setComentarios] = useState<comentariosValues[]>([])
  const { id } = useParams()
  const { setTitle } = useAuth()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)

  const getComentarios = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/showAdmin/${id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${token ?? ''}`
        }
      }
    )
    if (
      request.data[0].comentariosfinales &&
      JSON.parse(request.data[0].comentariosfinales).length > 0
    ) {
      setComentarios(JSON.parse(request.data[0].comentariosfinales))
    }
    setLoading(false)
  }

  useEffect(() => {
    setTitle('Listado de comentarios')
    getComentarios()
  }, [])

  return (
    <>
      {!loading
        ? <>
      <Link to={'/admin/productos/'} className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold mb-6 block w-fit">REGRESAR</Link>

      <ListaRese comentarios={comentarios} setComentarios={setComentarios} cursoId={id}/>

      </>
        : <Loading/>}
    </>
  )
}
