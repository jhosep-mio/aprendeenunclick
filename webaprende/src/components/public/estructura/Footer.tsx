
import { FloatingWhatsApp } from 'react-floating-whatsapp'
import { MdEmail, MdFacebook, MdLocalPhone } from "react-icons/md"
import { BsInstagram, BsTiktok } from "react-icons/bs"

import ico from '../../../assets/logo/ico.png'
export const Footer = (): JSX.Element => {
  return (
    <>
      <footer className="footer">
            <div className="footer__main">
                <div className="footer__main__item">
                    <h5 className="">Nosotros</h5>
                    <p>Somos más que una plataforma educativa; somos tu puerta de acceso a un mundo de conocimiento al alcance de un clic. </p>
                </div>
                <div className="footer__main__item">
                    <h5>Cursos</h5>
                    <ul>
                        <li>
                            <a href="#cursos">Matemáticas</a>
                        </li>
                        <li>
                            <a href="#cursos">Álgebra</a>
                        </li>
                        <li>
                            <a href="#cursos">Biología</a>
                        </li>
                        <li>
                            <a href="#cursos">Química</a>
                        </li>
                    </ul>
                </div>
                <div className="footer__main__item">
                    <h5>Enlaces</h5>
                    <ul>
                        <li>
                            <a href="#inicio">Inicio</a>
                        </li>
                        <li>
                            <a href="#planes">Planes</a>
                        </li>
                        <li>
                            <a href="#cursos">Cursos</a>
                        </li>
                        <li>
                            <a href="#contacto">Contacto</a>
                        </li>
                        
                    </ul>
                </div>
                <div className="footer__main__item">
                    <h5>Redes Sociales</h5>
                    <ul>
                        <li className="flex gap-2 items-center mb-2"> 
                            <MdLocalPhone className="text-4xl text-white"/>
                            <a href="">(+51) 987 654 321</a>
                        </li>
                        <li className="flex gap-2 items-center mb-4"> 
                            <MdEmail className="text-4xl text-white"/>
                            <a href="">info@aprendeenunclick.com</a>
                        </li>
                        <li className="flex gap-6 items-center mb-2"> 
                            <span className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#f9f9f9]">
                                <MdFacebook className="text-[#27275B] text-4xl"/>
                            </span>
                            <span className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#f9f9f9]">
                                <BsInstagram className="text-[#27275B] text-4xl"/>
                            </span>
                            <span className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#f9f9f9]">
                                <BsTiktok className="text-[#27275B] text-4xl"/>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
      </footer>

      <FloatingWhatsApp
            phoneNumber={`+51987654321`}
            accountName="Aprende en un Click"
            statusMessage="En linea"
            placeholder="Envianos un mensaje"
            chatMessage ="Hola un gusto! 🤝, Como podemos ayudarte?"
            avatar={ico}
            allowEsc
            allowClickAway
            notification
            notificationSound
        />
    </>
  )
}
