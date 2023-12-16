import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { PublicLayout } from '../components/public/PublicLayout'
import { AuthProvider } from '../context/AuthProvider'
import Home from '../components/public/Home'
import { Index } from '../components/public/aula/Index'
import { PublicAula } from '../components/public/PublicAula'
import Perfil from '../components/public/aula/Perfil'
import Cursos from '../components/public/aula/Cursos'
import Plan from '../components/public/aula/Plan'
import Curso from '../components/public/aula/Curso'
import Examen from '../components/public/aula/Examen'
import { Registro } from '../components/public/Registro'
import { Login } from '../components/public/Login'
import ViewCurso from '../components/public/aula/ViewCurso'
import { Succes } from '../components/public/Succes'

export const Routing = (): JSX.Element => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="success/:ui" element={<Succes />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="aula" element={<PublicAula />}>
            <Route index element={<Index />} />
            <Route path="perfil" element={<Perfil />}/>
            <Route path="cursos" element={<Cursos/>}/>
            <Route path='plan' element={<Plan/>}/>
            <Route path='cursos/curso/:id' element={<Curso/>}/>
            <Route path='cursos/curso/:id/examen-entrada' element={<Examen/>}/>
          </Route>
          <Route path="cursos/curso/:id/clases/clase/:idClase" element={<ViewCurso/>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
