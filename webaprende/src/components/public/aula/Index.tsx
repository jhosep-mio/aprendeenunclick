import { Link } from 'react-router-dom'
import banner1 from '../../../assets/aula/banner/banner1.png'
import { SiGitbook } from 'react-icons/si'
import { MdGrade } from 'react-icons/md'
import teacher from '../../../assets/aula/cursos/teacher.png'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Global } from '../../../helper/Global'
import axios from 'axios'
import { type productosValues } from '../../shared/Interfaces'
import { useEffect, useState } from 'react'
import { formatearURL } from '../../shared/funtions'

export const Index = (): JSX.Element | undefined => {
  const [cursos, setCursos] = useState<productosValues[]>([])
  const token = localStorage.getItem('tokenUser')

  const getCursos = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getProductosToAula`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setCursos(request.data)
  }

  useEffect(() => {
    getCursos()
  }, [])

  return (
    <>
      <div className="load"></div>
      <section className="aula">
        <div className="aula__main">
          <div className="aula__main__item">
            <img src={banner1} alt="" />
          </div>
          <div className="aula__main__item" style={{ paddingLeft: '10rem' }}>
            <h2>
              Bienvenido <br /> a Nuestra
              <br /> <span>Aula Virtual </span>
            </h2>
            <p>
              Aquí podrás visualizar los cursos disponibles y tus calificaciones
            </p>
            <div className="aula__main__item__links">
              <Link to="/aula/mis_calificaciones" className="btn3">
                <div className="svg-wrapper-1">
                  <div className="svg-wrapper">
                    <MdGrade />
                  </div>
                </div>
                <span>Mis calificaciones</span>
              </Link>
              <Link to="cursos" className="btn1">
                <div className="svg-wrapper-1">
                  <div className="svg-wrapper">
                    <SiGitbook />
                  </div>
                </div>
                <span>Mis cursos</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="items">
        <div className="items__main">
          <div className="items__main__item">
            <img src={teacher} alt="" />
          </div>
          <div className="items__main__item">
            <h2>Tus cursos</h2>
            <p>Puedes seguir el progreso de tus cursos en esta sección</p>
            <div className="items__main__item__cursos">
              <Swiper
                slidesPerView={2}
                loop={true}
                spaceBetween={30}
                className="mb-[30px]"
              >
                {cursos.map((curso) => (
                  <SwiperSlide key={curso.id}>
                    <Link to={`/aula/cursos/curso/${curso.id}-${formatearURL(curso.nombre)}`} className="cardCursito">
                      <div className="cardCursito__img">
                        <img
                          src={`${Global.urlImages}/productos/${curso.imagen}`}
                          alt=""
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      </div>
                      <div className="cardCursito__info">
                        <h5>{curso.nombre}</h5>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper slidesPerView={2} loop={true} spaceBetween={30} >
                {cursos.reverse().map((curso) => (
                  <SwiperSlide key={curso.id}>
                    <Link to={`/aula/cursos/curso/${curso.id}-${formatearURL(curso.nombre)}`} className="cardCursito">
                      <div className="cardCursito__img">
                        <img
                          src={`${Global.urlImages}/productos/${curso.imagen}`}
                          alt=""
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      </div>
                      <div className="cardCursito__info">
                        <h5>{curso.nombre}</h5>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
