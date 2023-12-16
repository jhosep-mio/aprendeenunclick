import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Global } from '../../helper/Global'
import {
  BiSolidBookmarks
} from 'react-icons/bi'
import draw1 from './../../assets/success/animate1.gif'
import draw2 from './../../assets/success/undraw_completed_03xt.gif'
import draw3 from './../../assets/success/undraw_happy_announcement_re_tsm0.svg'
import draw4 from './../../assets/success/undraw_online_party_re_7t6g.svg'
import draw5 from './../../assets/success/undraw_super_thank_you_re_f8bo.svg'
import draw6 from './../../assets/success/undraw_well_done_re_3hpo.svg'
export const Succes = (): JSX.Element => {
  const { ui } = useParams()
  const [, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const images = ['draw1', 'draw2', 'draw3', 'draw4', 'draw5', 'draw6']
  const randomIndex = Math.floor(Math.random() * images.length)
  const randomImage = images[randomIndex]

  const validarTransaccion = async (): Promise<void> => {
    if (ui) {
      const data = new FormData()
      data.append('ui', String(ui))
      const request = await axios.post(`${Global.url}/oneTransaccion/${ui}`)
      if (request.data.length === 0) {
        navigate('/carrito')
      }
    } else {
      navigate('/carrito')
    }
    setLoading(false)
  }

  useEffect(() => {
    validarTransaccion()
  }, [])

  return (
    <>
      <div className="h-fit w-[99wv] flex items-center justify-center p-0 pt-[180px]">
        <section className="window px-20 pb-20" style={{ overflow: 'hidden' }}>
          <div className="window__wrapper">
            <div className="window__wrapper__head">
              <h2>
                Compra realizada exitosamente
              </h2>
            </div>
            <div
              className="window__wrapper__body"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <h3>
                Se le envio un correo con los detalles de su compra
                <strong className="text-4xl md:text-5xl font-bold"></strong>
              </h3>
              <picture>
                <img
                  src={
                    (randomImage === 'draw1' ? draw1 : '') ||
                    (randomImage === 'draw2' ? draw2 : '') ||
                    (randomImage === 'draw3' ? draw3 : '') ||
                    (randomImage === 'draw4' ? draw4 : '') ||
                    (randomImage === 'draw5' ? draw5 : '') ||
                    (randomImage === 'draw6' ? draw6 : '')
                  }
                  alt=""
                />
              </picture>
            </div>
            <div className="window__wrapper__footer">
              <Link
                className="window__wrapper__footer__what cursor-pointer"
                to='/mis_cursos'
              >
                <BiSolidBookmarks/>Mis cursos
              </Link>
              <p className="text-lg w-full text-center font-semibold mt-6">
                El plan ya fue agregado a su cuenta, ya tiene acceso a los cursos.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
