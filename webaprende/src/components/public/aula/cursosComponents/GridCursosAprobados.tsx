import { type valuesExamenesEntrada, type productosValues } from '../../../shared/Interfaces'
import { Link } from 'react-router-dom'
import CardCursoAprobados from './CardCursoAprobados'

const GridCursosAprobados = ({ cursos, examenes, examenesCurso }: { cursos: productosValues[], examenes: valuesExamenesEntrada[], examenesCurso: valuesExamenesEntrada[] }): JSX.Element => {
  return (
    <>
      <div className="profileCursos">
        <div className="profileCursos__main">
          {cursos.length > 0
            ? cursos.map((curso) => (
            <div className="profileCursos__main__item" key={curso.id}>
              <CardCursoAprobados curso={curso} examenes={examenes} examenesCurso={examenesCurso}/>
            </div>
            ))
            : <div className='w-full h-full flex justify-center items-center flex-col gap-12'>
                <p className='text-white text-4xl pt-12'>☹️ No tienes un plan activo </p>
                <Link to='/aula/plan' className='text-white text-3xl  bg-paleta-800 hover:bg-paleta-800/70 transition-colors rounded-xl px-6 py-3'>Adquirir un plan</Link>
            </div>
            }
        </div>
      </div>
    </>
  )
}

export default GridCursosAprobados
