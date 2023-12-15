import { Link } from 'react-router-dom'

import { SiGitbook } from 'react-icons/si'
import { home2 } from '../shared/images'
import { VscBook } from 'react-icons/vsc'
import { PiCertificate } from 'react-icons/pi'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/grid'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { MdEmail, MdLocalPhone, MdOutlineWhatsapp } from 'react-icons/md'
import { useEffect, useState } from 'react'
import useAuth from '../../hooks/useAuth'
import Loading from '../shared/Loading'
import { type productosValues } from '../shared/Interfaces'
import axios from 'axios'
import { Global } from '../../helper/Global'
import { ListaPlanes } from './planes/ListaPlanes'

const Home = (): JSX.Element => {
  const { auth, token, loading } = useAuth()
  const [cursos, setCursos] = useState<productosValues[]>([])
  const [loadingComponent, setLoadingComponent] = useState(false)

  const getCursos = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getProductosToAula`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setCursos(request.data)
    console.log(request.data)
    setLoadingComponent(false)
  }

  useEffect(() => {
    getCursos()
  }, [loading])

  return (
    <>
      {loadingComponent && <Loading />}
      <section className="sectSlide" id="inicio">
        <div className="sectSlide__main">
          <div className="sectSlide__main__item">
            <h2>
              El poder de <span className="text-[#B43A34]">tu futuro</span>{' '}
              <br />
              está en <span className="text-[#27275B]">tus manos</span>
            </h2>
            <p>
              Contamos con profesionales especializados en la enseñanza a
              estudiantes más jóvenes. Nuestros instructores están comprometidos
              con el éxito académico y personal de tus hijos.
            </p>

            <Link to={auth.id ? '/aula/cursos' : '/login'} className="btn1">
              <div className="svg-wrapper-1">
                <div className="svg-wrapper">
                  <SiGitbook />
                </div>
              </div>
              <span>Ver cursos</span>
            </Link>
          </div>
          <div className="sectSlide__main__item">
            <img src={home2} alt="" />
          </div>
        </div>
      </section>

      <ListaPlanes/>

      <section className="sectNosotros">
        <div className="sectNosotros__main">
          <div className="sectNosotros__main__item"></div>
          <div className="sectNosotros__main__item">
            <h2>
              El aprendizaje no <span>tiene límites</span>
            </h2>
            <p>
              Rompe barreras con nuestros cursos en línea diseñados para ti.
            </p>

            <div className="extras">
              <div className="extras__main">
                <div className="extras__main__item">
                  <VscBook /> Cursos actualizados
                </div>
                <div className="extras__main__item">
                  <PiCertificate /> Certificado de finalización
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sectCursos" id="cursos">
        <div className="sectCursos__title">
          <h2>Cursos que ofrecemos</h2>
        </div>
        <div className="sectCursos__main">
          {cursos?.map((curso) => (
            <div className="sectCursos__main__item" key={curso.id}>
              <div className="" style={{ background: `url(${Global.urlImages}/productos/${curso.imagen})` }}>
                <span>{curso.nombre}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="contacto" id="contacto">
        <div className="contacto__main">
          <div className="contacto__main__item">
            <div className="contacto__main__item__info">
              <div className="contacto__main__item__info__ico">
                <span>
                  <MdLocalPhone />
                </span>
              </div>
              <div className="contacto__main__item__info__content">
                <strong>Celular</strong>
                (+51) 987 654 321
              </div>
            </div>

            <div className="contacto__main__item__info">
              <div className="contacto__main__item__info__ico">
                <span>
                  <MdEmail />
                </span>
              </div>
              <div className="contacto__main__item__info__content">
                <strong>Email</strong>
                informacion@aprendeenunclick.com
              </div>
            </div>

            <div className="contacto__main__item__info">
              <div className="contacto__main__item__info__ico">
                <span>
                  <MdOutlineWhatsapp />
                </span>
              </div>
              <div className="contacto__main__item__info__content">
                <strong>Whatsapp</strong>
                (+51) 987 654 321
              </div>
            </div>

            <div className="contacto__main__item__info">
              <div className="contacto__main__item__info__ico">
                <span>
                  <MdLocalPhone />
                </span>
              </div>
              <div className="contacto__main__item__info__content">
                <strong>Celular</strong>
                (+51) 963 852 741
              </div>
            </div>
          </div>

          <div className="contacto__main__item">
            <h6>Envíanos tu consulta</h6>
            <p>
              Si tienes alguna pregunta, sugerencia o necesitas asistencia, ¡no
              dudes en contactarnos a través de nuestro formulario web!
            </p>

            <form action="">
              <div className="flex gap-10  mb-6">
                <div className="w-1/2">
                  <input
                    placeholder="Nombres"
                    className="input-style"
                    type="text"
                  />
                </div>
                <div className="w-1/2">
                  <input
                    placeholder="Email"
                    className="input-style"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex gap-10 mb-6">
                <div className="w-1/2">
                  <input
                    placeholder="Celular"
                    className="input-style"
                    type="text"
                  />
                </div>
                <div className="w-1/2">
                  <input
                    placeholder="Asunto"
                    className="input-style"
                    type="text"
                  />
                </div>
              </div>
              <div className="w-full">
                <textarea
                  name=""
                  id=""
                  placeholder="Mensaje"
                  cols={20}
                  rows={4}
                  className="input-style"
                ></textarea>
              </div>
              <input type="submit" value="Enviar" className="btn2" />
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
