import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { useParams } from 'react-router-dom'
import {
  type productosValues,
  type examenValues
} from '../../../../shared/Interfaces'
import { Fragment, useEffect, useState } from 'react'
import {
  RiArrowRightSLine,
  RiBookmark2Line,
  RiFolderZipLine
} from 'react-icons/ri'
import { defaultperfil } from '../../../../shared/Images'
import useAuth from '../../../../../hooks/useAuth'

export const IndexExamenes = (): JSX.Element => {
  const { id } = useParams()
  const { setTitle } = useAuth()
  const tokenUser = localStorage.getItem('token')
  const [examenes, setexamenes] = useState<examenValues[]>([])
  const [curso, setCurso] = useState<productosValues | null>(null)

  const getEstudiantes = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getEstudiantes`, {
      headers: {
        Authorization: `Bearer ${
          tokenUser !== null && tokenUser !== '' ? tokenUser : ''
        }`
      }
    })
    setexamenes(request.data)
  }

  const getOneData = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/showAdmin/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${tokenUser ?? ''}`
      }
    })

    const responseData = request.data[0]
    setCurso(JSON.parse(responseData.contenido))
  }

  useEffect(() => {
    getEstudiantes()
    getOneData()
    setTitle('Examenes')
  }, [])

  return (
    <div className="w-full gap-10 max-w-[1450px] lg:px-0 mx-auto justify-start mt-4 grid grid-cols-1 lg:grid-cols-3">
      {examenes.map((estudiante: any) =>
        JSON.parse(estudiante.listaexamen)?.map((examen: any) => {
          const clasesCoincidentes = curso
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
            ?.map((curso: any) =>
              curso.clase.filter((clase: any) => clase.id === examen.id)
            )
            .flat() // aplanar el array de arrays
          console.log(clasesCoincidentes)
          return (
            <Fragment key={examen.id}>
              {clasesCoincidentes.map((clase: any) => (
                <div
                  className="rounded-xl overflow-hidden shadow-md relative"
                  key={clase.id}
                >
                  <div className="absolute top-2 right-4 cursor-pointer flex flex-col gap-0 items-center justify-center">
                    <span className="text-base underline text-black">
                      Calificación
                    </span>
                    <span className="text-2xl text-black">{examen.nota}</span>
                  </div>
                  <div className="bg-white rounded-3xl p-2 shadow-xl">
                    <div className="flex flex-row items-center gap-4 mb-6 p-4 mt-3">
                      <div className="flex items-center justify-center rounded-full w-10 h-10 min-w-[2rem]">
                        <RiFolderZipLine className="text-2xl text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary text-xl">
                          {clasesCoincidentes[0]?.titulo}
                        </h3>
                      </div>
                    </div>
                    <div className="flex flex-row items-center justify-between gap-8 mb-2 px-4">
                      <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                        <div className="w-12 h-12 relative flex items-center">
                          <img
                            src={defaultperfil}
                            alt="Hombre"
                            loading="lazy"
                            className="rounded-full object-cover m-auto"
                          />
                        </div>
                        <h5 className="text-neutral-500 " key={estudiante.id}>
                          {estudiante.nombres} {estudiante.apellidos}
                        </h5>
                      </div>
                      <div className="flex flex-col md:flex-row items-center gap-2 text-neutral-600 w-full justify-end">
                        <RiBookmark2Line />
                      </div>
                    </div>
                    <div className="flex items-center justify-between  px-4 rounded-2xl">
                      <button
                        type="button"
                        className="flex items-center text-lg underline px-2 py-4 text-green-700 rounded-lg hover:bg-white transition-colors duration-300"
                      >
                        Ver exámen <RiArrowRightSLine />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Fragment>
          )
        })
      )}
    </div>
  )
}
