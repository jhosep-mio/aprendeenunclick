import { Link, useNavigate } from 'react-router-dom'
import { logo_white } from '../../../shared/images'
import { GoTriangleDown } from 'react-icons/go'
import { PiBookOpenTextLight, PiExam } from 'react-icons/pi'
import { CiShoppingTag, CiSettings, CiLogout } from 'react-icons/ci'
import useAuth from '../../../../hooks/useAuth'
import perfil from '../../../../assets/aula/perfil/perfil.png'
import { Global } from '../../../../helper/Global'
import axios from 'axios'
import { useEffect } from 'react'

const HeaderAula = (): JSX.Element => {
  const navigate = useNavigate()
  const { auth, setAuth, loading } = useAuth()
  const token = localStorage.getItem('tokenUser')
  const cerrarSession = async (): Promise<void> => {
    console.log(token)
    const data = new FormData()
    data.append('_method', 'POST')
    await axios.post(`${Global.url}/logout`, data, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    localStorage.setItem('tokenUser', '')
    localStorage.setItem('estudiante', '')
    setAuth({
      id: '',
      name: '',
      email: '',
      idRol: null,
      onlyname: '',
      lastname: '',
      foto: '',
      portada: ''
    })
    navigate('/')
  }
  useEffect(() => {
    if (!loading && !auth.id) {
      navigate('/')
    }
  }, [auth.id, loading])

  return (
    <>
      <header className="headerAula">
        <nav className="headerAula__nav">
          <div className="headerAula__nav__logo">
            <picture className="">
              <Link to="/aula">
                <img src={logo_white} alt="" />
              </Link>
            </picture>
          </div>
          <div className="headerAula__nav__user">
            <button className="">
              <img
                src={
                  auth.foto
                    ? `${Global.urlImages}/fotoperfil/${auth.foto}`
                    : perfil
                }
                className="w-20 h-20 object-contain rounded-full"
              />
            </button>
            <div className="headerAula__nav__user__name">
              <button>
                {auth.onlyname} <GoTriangleDown />
              </button>
            </div>

            <div className="profile">
              <ul>
                <li>
                  <Link to="cursos">
                    <PiBookOpenTextLight />
                    Mis cursos
                  </Link>
                </li>
                <li>
                  <Link to="/aula/mis_calificaciones">
                    <PiExam />
                    Mis calificaciones
                  </Link>
                </li>
                <li>
                  <Link to="plan">
                    <CiShoppingTag />
                    Mi plan
                  </Link>
                </li>
                <li>
                  <Link to="perfil">
                    <CiSettings />
                    Configuración
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onClick={async () => {
                      await cerrarSession()
                    }}
                  >
                    <CiLogout />
                    Cerrar sesión
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default HeaderAula
