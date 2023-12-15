import { Link, useNavigate } from 'react-router-dom'
import banner1 from '../../../assets/aula/banner/banner1.png'
import { SiGitbook } from 'react-icons/si'
import { MdGrade } from 'react-icons/md'
import teacher from '../../../assets/aula/cursos/teacher.png'
import { Swiper, SwiperSlide } from 'swiper/react'
import { BiMath } from 'react-icons/bi'
import 'swiper/css'
import useAuth from '../../../hooks/useAuth'
import { useEffect } from 'react'

export const Index = (): JSX.Element | undefined => {
  const { auth, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !auth.id) {
      navigate('/')
    }
  }, [auth.id, loading])

  return (
        <>
          <div className="load"></div>
          <section className="aula">
            <div className="aula__main">
              <div className="aula__main__item" style={{ paddingLeft: '10rem' }}>
                <h2>
                  Bienvenido <br /> a Nuestra
                  <br /> <span>Aula Virtual </span>
                </h2>
                <p>
                  Aquí podrás visualizar los cursos disponibles y tus calificaciones
                </p>
                <div className="aula__main__item__links">
                  <Link to="/" className="btn3">
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
              <div className="aula__main__item">
                <img src={banner1} alt="" />
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
                    <SwiperSlide>
                      <div className="cardCursito">
                        <div className="cardCursito__img">
                          <span>
                            <BiMath />
                          </span>
                        </div>
                        <div className="cardCursito__info">
                          <h5>Matemáticas</h5>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="cardCursito">
                        <div className="cardCursito__img">
                          <span>
                            <BiMath />
                          </span>
                        </div>
                        <div className="cardCursito__info">
                          <h5>Matemáticas</h5>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="cardCursito">
                        <div className="cardCursito__img">
                          <span>
                            <BiMath />
                          </span>
                        </div>
                        <div className="cardCursito__info">
                          <h5>Matemáticas</h5>
                        </div>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                  <Swiper slidesPerView={2} loop={true} spaceBetween={30}>
                    <SwiperSlide>
                      <div className="cardCursito">
                        <div className="cardCursito__img">
                          <span>
                            <BiMath />
                          </span>
                        </div>
                        <div className="cardCursito__info">
                          <h5>Matemáticas</h5>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="cardCursito">
                        <div className="cardCursito__img">
                          <span>
                            <BiMath />
                          </span>
                        </div>
                        <div className="cardCursito__info">
                          <h5>Matemáticas</h5>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="cardCursito">
                        <div className="cardCursito__img">
                          <span>
                            <BiMath />
                          </span>
                        </div>
                        <div className="cardCursito__info">
                          <h5>Matemáticas</h5>
                        </div>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
              </div>
            </div>
          </section>
        </>
  )
}
