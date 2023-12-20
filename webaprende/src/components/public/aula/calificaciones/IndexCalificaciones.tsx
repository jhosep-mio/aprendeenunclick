import { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Global } from '../../../../helper/Global'
import axios from 'axios'
import {
  type valuesClase,
  type valuesExamenesEntrada,
  type valuesCurso2
} from '../../../shared/Interfaces'

export const IndexCalificaciones = (): JSX.Element => {
  const [expanded, setExpanded] = useState<string | false>(false)
  const token = localStorage.getItem('tokenUser')
  const [cursos, setCursos] = useState<valuesCurso2[]>([])
  const [examenes, setexamenes] = useState<valuesExamenesEntrada[]>([])

  const getCursos = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getProductosToAula`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setCursos(request.data)

    const request3 = await axios.get(`${Global.url}/perfilEstudiante`, {
      headers: {
        Authorization: `Bearer ${token ?? ''}`
      }
    })
    const examenEntradaArray = request3.data.user.listaexamen
      ? JSON.parse(request3.data.user.listaexamen)
      : []
    setexamenes(examenEntradaArray)
  }

  useEffect(() => {
    getCursos()
  }, [])

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  return (
    <section className="viewCurso">
      <div className="viewCurso__main flex flex-col gap-20">
        <h1 className="text-center text-7xl font_main text-white w-full underline">
          Mis calificaciones
        </h1>
        <section className="w-[50%] mx-auto">
          {cursos
            .filter((curso) =>
              curso.clase?.some((clase) =>
                examenes.some((examen) =>
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                  clase.clase?.some((clase2) => clase2.id === examen.id)
                )
              )
            )
            .map((curso) => (
              <Accordion
                key={curso.id}
                className="acordion_miscali"
                expanded={expanded === `panel${curso.id}`}
                onChange={handleChange(`panel${curso.id}`)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${curso.id}bh-content`}
                  id={`panel${curso.id}bh-header`}
                >
                  <h1 className="text-white text-4xl font_main font-bold uppercase">
                    { // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                    curso.nombre}
                  </h1>
                </AccordionSummary>
                <AccordionDetails>
                  <section>
                    <div className="flex flex-col gap-4 bg-red w-full">
                      {curso.clase?.map((clase) => {
                        // Filtra clases que tienen exámenes asociados
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        const clasesConExamen = clase.clase?.filter((clase2) =>
                          examenes.some((examen) => clase2.id === examen.id)
                        )
                        // Muestra solo si hay clases con exámenes
                        if (clasesConExamen && clasesConExamen.length > 0) {
                          return (
                                <div key={clase.id} className='pb-6'>
                                  <p className="text-3xl text-gray-300 uppercase font-bold">
                                    * {clase.titulo}
                                  </p>
                                  {clasesConExamen.map((clase2: valuesClase) => {
                                    const examenAsociado = examenes.find(
                                      (examen) => examen.id === clase2.id
                                    )
                                    if (examenAsociado) {
                                      return (
                                        <div key={clase2.id} className='flex justify-between pb-6 px-10 pt-3 items-center'>
                                          <p className="text-3xl text-gray-300">
                                            {'>'} Examen: {clase2.titulo}
                                          </p>
                                          <p className={`${examenAsociado.nota > 5.5 ? 'bg-green-500' : 'bg-red-500'} py-2 px-4 text-gray-300 font-extrabold text-3xl`}>
                                            Nota: {examenAsociado.nota}
                                          </p>
                                          {/* Agrega aquí cualquier otra información del examen que desees mostrar */}
                                        </div>
                                      )
                                    }
                                    return null
                                  })}
                                </div>
                          )
                        }

                        return null // No hay exámenes para este curso
                      })}
                    </div>
                  </section>
                </AccordionDetails>
              </Accordion>
            ))}
        </section>
      </div>
    </section>
  )
}
