import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'
import { Login } from '../components/public/Login'
import { PrivateLayout } from '../components/private/PrivateLayout'
import Home from '../components/private/tables/Home'
import { EditarContacto } from '../components/private/tables/contacto/EditarContacto'
import { ListaTransacciones } from '../components/private/tables/transacciones/ListaTransacciones'
import { EditarTransaccion } from '../components/private/tables/transacciones/EditarTransaccion'
import { ListaAlumnos } from '../components/private/tables/alumnos/ListaAlumnos'
import { VerEstudiante } from '../components/private/tables/alumnos/VerEstudiante'
import { ListadoExamenes } from '../components/private/tables/examenes/ListadoExamenes'
import { CrearExamen } from '../components/private/tables/examenes/CrearExamen'
import { EditarExamen } from '../components/private/tables/examenes/EditarExamen'
import { ListaCursos } from '../components/private/tables/cursos/ListaCursos'
import { CrearCurso } from '../components/private/tables/cursos/CrearCurso'
import { EditarProducto } from '../components/private/tables/cursos/EditarProducto'
import { TemarioCurso } from '../components/private/tables/cursos/TemarioCurso'
import { ListadoExamenesEntrada } from '../components/private/tables/examenesentrada/ListadoExamenesEntrada'
import { CrearExamenEntrada } from '../components/private/tables/examenesentrada/CrearExamenEntrada'
import { EditarExamenEntrada } from '../components/private/tables/examenesentrada/EditarExamenEntrada'
import { ListaArchivosEjercicios } from '../components/private/tables/cursos/recursosTermario/ListaArchivosEjercicios'

export const Routing = (): JSX.Element => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="admin" element={<PrivateLayout />}>
            <Route index element={<Home />} />

            {/* ALUMNOS */}
            <Route path="alumnos" element={<ListaAlumnos />} />
            <Route path="alumnos/view/:id" element={<VerEstudiante />} />

            {/* cursos */}
            <Route path="cursos" element={<ListaCursos />} />
            <Route path="cursos/agregar" element={<CrearCurso />} />
            <Route path="cursos/editar/:id" element={<EditarProducto />} />
            <Route path="cursos/temario/:id" element={<TemarioCurso />} />
            <Route path="cursos/temario/:id/archivos/:claseId" element={<ListaArchivosEjercicios />} />
            {/* <Route path="cursos/seguimiento/:id" element={<Seguimiento />} />
            <Route path="cursos/seguimiento/:id/comentarios/:claseId" element={<Comentarios />} />
            <Route path="cursos/seguimiento/:id/archivos/:claseId" element={<ListaArchivos />} />
            <Route path="cursos/resenas/:id" element={<ListaReseneas />} /> */}

            {/* CONFIGURACION */}
            <Route path="contacto/:id" element={<EditarContacto />} />
            <Route path="transacciones" element={<ListaTransacciones />} />
            <Route path="transacciones/viewTransaccion/:id" element={<EditarTransaccion />} />

            {/* EXAMENES */}
            <Route path="examenes" element={<ListadoExamenes />} />
            <Route path="examenes/agregar" element={<CrearExamen />} />
            <Route path="examenes/editar/:id" element={<EditarExamen />} />

            <Route path="examenesdeentrada" element={<ListadoExamenesEntrada />} />
            <Route path="examenesdeentrada/agregar" element={<CrearExamenEntrada />} />
            <Route path="examenesdeentrada/editar/:id" element={<EditarExamenEntrada />} />
          </Route>
          <Route path="*" element={<>Error 404</>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
