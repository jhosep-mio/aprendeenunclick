import { Link } from 'react-router-dom'
import { logo } from '../../shared/images'
export const Header = (): JSX.Element => {
  return (
    <>
      <header className="header">
        <div className="header__main">
          <div className="header__main__logo">
            <Link to="/">
              <img src={logo} alt="" />
            </Link>
          </div>
          <div className="header__main__items">
            <nav className="header__main__items__nav">
              <ul>
                <li>
                  <a href="/#inicio">Inicio</a>
                </li>
                <li>
                  <a href="/#planes">Planes</a>
                </li>
                <li>
                  <a href="/#cursos">Cursos</a>
                </li>
                <li>
                  <a href="/#contacto">Contacto</a>
                </li>
              </ul>
            </nav>
            <div className="header__main__items__buttons">
              <Link to="/login" className="btn2">
                Ingresar
              </Link>
              {/* <Link to="/carrito" className="btn-carrito">
                            <BsCartCheckFill/>
                            <span>4</span>
                        </Link> */}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
