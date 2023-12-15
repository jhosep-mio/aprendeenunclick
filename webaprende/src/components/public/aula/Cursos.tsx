import { useState } from 'react'
import TabsCursos from './cursosComponents/Tabs'
import CardGeneral from './perfilComponents/CardGeneral'
import Loading from '../../shared/Loading'

const Cursos = (): JSX.Element => {
  const [loadingComponent, setLoadingComponent] = useState(true)

  return (
    <>
      {loadingComponent && <Loading/>}
        <section className="cursos min-h-screen">
            <div className="cursos__main">
                <div className="cursos__main__title">
                    <h2>Mis cursos</h2>
                </div>
                <div className="cursos__main__tabs">
                    <TabsCursos setLoadingComponent={setLoadingComponent}/>
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
