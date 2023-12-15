import { useState } from 'react'
import FormData from '../../shared/pagos/FormData'

export const ListaPlanes = (): JSX.Element => {
  const [open, setOpen] = useState(false)

  const handleOpen = (): void => {
    setOpen(true)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  const [plan, setPlan] = useState(0)
  return (
    <>
      <section className="planes" id="planes">
        <div className="planes__title mb-16">
          <h2>Tenemos los mejores planes para ti</h2>
        </div>
        <div
          className={`mx-auto relative w-[500px] bg-gray-300 text-center flex items-center justify-center mb-20 transition-all font_main z-[1]

        ${plan == 1 ? 'before:left-0 before:right-[inherit] ' : ''}
        ${plan == 0 ? 'before:right-0 before:left-[inherit] ' : ''}
        
        before:bg-paleta-800 before:absolute before:rounded-lg before:left-0 before:w-1/2  before:h-full before:-z-[1] before:transition-all
        `}
        >
          <button
            className={`text-3xl font-bold uppercase w-1/2 h-[40px] z-[1] text-center
            ${plan == 1 ? 'text-white' : 'text-black'}
            `}
            onClick={() => {
              setPlan(1)
            }}
          >
            Plan basico
          </button>
          <button
            className={`text-3xl font-bold uppercase w-1/2 h-[40px] z-[1] text-center
            ${plan == 0 ? 'text-white' : 'text-black'}
            `}
            onClick={() => {
              setPlan(0)
            }}
          >
            Plan Premium
          </button>
        </div>
        {plan == 1
          ? (
          <>
            <ul className=" pb-6 list-disc pl-16 mx-auto w-fit mb-10 ">
              <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800">
                Resolución de problemas
              </li>
              <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800">
                Solo visualiza los temarios
              </li>
              <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800">
                Ingreso a examenes
              </li>
            </ul>
            <div className="planes__main">
              <div className="planes__main__item">
                <div className="planes__main__item__content">
                  <div className="planes__main__item__content__head">
                    <span>1 mes</span>
                    <h5>S/. 49.90</h5>
                  </div>

                  <div className="planes__main__item__content__foot">
                    <button type="button" onClick={handleOpen} className="btn2">
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
              <div className="planes__main__item">
                <div className="planes__main__item__content">
                  <div className="planes__main__item__content__head">
                    <span>3 Meses</span>
                    <h5>S/. 140.90</h5>
                  </div>
                  <div className="planes__main__item__content__foot">
                    <button type="button" onClick={handleOpen} className="btn2">
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
              <div className="planes__main__item">
                <div className="planes__main__item__content">
                  <div className="planes__main__item__content__head">
                    <span>6 meses</span>
                    <h5>S/. 280.90</h5>
                  </div>
                  <div className="planes__main__item__content__foot">
                    <button type="button" onClick={handleOpen} className="btn2">
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
            )
          : (
          <>
            <ul className=" pb-6 list-disc pl-16 mx-auto w-fit mb-10 gap-32 columns-2">
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800">
                Clases interactivas
              </li>
              <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800">
                Clasificacion segun rendimiento
              </li>
              <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800">
                Seguimiento de avances
              </li>
              <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800">
                Acessos para el padre de familia
              </li>
              <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800">
                Resolución de problemas
              </li>
              <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800">
                Solo visualiza los temarios
              </li>
              <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800">
                Ingreso a examenes
              </li>
            </ul>
            <div className="planes__main">
              <div className="planes__main__item">
                <div className="planes__main__item__content">
                  <div className="planes__main__item__content__head">
                    <span>1 mes</span>
                    <h5>S/. 65.90</h5>
                  </div>

                  <div className="planes__main__item__content__foot">
                    <button type="button" onClick={handleOpen} className="btn2">
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
              <div className="planes__main__item">
                <div className="planes__main__item__content">
                  <div className="planes__main__item__content__head">
                    <span>3 Meses</span>
                    <h5>S/. 197.90</h5>
                  </div>
                  <div className="planes__main__item__content__foot">
                    <button type="button" onClick={handleOpen} className="btn2">
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
              <div className="planes__main__item">
                <div className="planes__main__item__content">
                  <div className="planes__main__item__content__head">
                    <span>6 meses</span>
                    <h5>S/. 390.90</h5>
                  </div>
                  <div className="planes__main__item__content__foot">
                    <button type="button" onClick={handleOpen} className="btn2">
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
            )}
      </section>
      {open && <FormData open={open} handleClose={handleClose} />}
    </>
  )
}
