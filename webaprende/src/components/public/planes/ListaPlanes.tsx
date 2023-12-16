import { useState } from 'react'
import FormData from '../../shared/pagos/FormData'
import { motion, AnimatePresence } from 'framer-motion'
import { type planValues } from '../../shared/Interfaces'

export const ListaPlanes = (): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [dataplan, setDataPlan] = useState<null | planValues>(null)

  const [plan, setPlan] = useState(0)
  const variants = {
    open: { left: '0' },
    closed: { left: '50%' }
  }

  return (
    <>
      <section className="planes h-[800px]" id="planes">
        <div className="planes__title mb-16">
          <h2>Tenemos los mejores planes para ti</h2>
        </div>
        <div
          className={`mx-auto relative w-[500px] bg-gray-300 text-center flex items-center justify-center mb-20 transition-all font_main z-[1]
        
        `}
        >
          <motion.span
            animate={plan == 0 ? 'open' : 'closed'}
            variants={variants}
            className="bg-paleta-800 absolute rounded-lg left-0 w-1/2  h-full -z-[1]"
          ></motion.span>
          <button
            className={`text-3xl font-bold uppercase w-1/2 h-[40px] z-[1] text-center
            ${plan == 0 ? 'text-white' : 'text-black'}
            `}
            onClick={() => {
              setPlan(0)
            }}
          >
            Plan basico
          </button>
          <button
            className={`text-3xl font-bold uppercase w-1/2 h-[40px] z-[1] text-center
            ${plan == 1 ? 'text-white' : 'text-black'}
            `}
            onClick={() => {
              setPlan(1)
            }}
          >
            Plan Premium
          </button>
        </div>

        <AnimatePresence>
          {plan == 0 && (
            <>
              <motion.ul
                initial={{ opacity: 0, display: 'none' }}
                animate={{ opacity: 1, display: 'block' }}
                exit={{ opacity: 0, display: 'none' }}
                className=" pb-6 list-disc pl-16 mx-auto w-fit mb-10 columns-3 gap-52"
              >
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800">
                  Resolución de problemas
                </li>
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800">
                  Solo visualiza los temarios
                </li>
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800">
                  Ingreso a examenes
                </li>
              </motion.ul>
              <motion.div
                initial={{ opacity: 0, display: 'none' }}
                animate={{ opacity: 1, display: 'flex' }}
                exit={{ opacity: 0, display: 'none' }}
                className="planes__main"
              >
                <div className="planes__main__item">
                  <div className="planes__main__item__content">
                    <div className="planes__main__item__content__head">
                      <span>1 mes</span>
                      <h5>S/. 49.90</h5>
                    </div>
                    <div className="planes__main__item__content__foot">
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(true)
                          setDataPlan({ nombre: 'Plan Basico', tiempo: '1 mes', precio: 49.90 })
                        }}
                        className="btn2"
                      >
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
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(true)
                          setDataPlan({ nombre: 'Plan Basico', tiempo: '3 meses', precio: 140.90 })
                        }}
                        className="btn2"
                      >
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
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(true)
                          setDataPlan({ nombre: 'Plan Basico', tiempo: '6 meses', precio: 280.90 })
                        }}
                        className="btn2"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {plan == 1 && (
            <>
              <motion.ul
                initial={{ opacity: 0, display: 'none' }}
                animate={{ opacity: 1, display: 'block' }}
                exit={{ opacity: 0, display: 'none' }}
                className=" pb-6 list-disc pl-16 mx-auto w-fit mb-10 gap-52 columns-3 ro"
              >
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800 ">
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
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800">
                  Control de progreso
                </li>
              </motion.ul>
              <motion.div
                initial={{ opacity: 0, display: 'none' }}
                animate={{ opacity: 1, display: 'flex' }}
                exit={{ opacity: 0, display: 'none' }}
                className="planes__main"
              >
                <div className="planes__main__item">
                  <div className="planes__main__item__content">
                    <div className="planes__main__item__content__head">
                      <span>1 mes</span>
                      <h5>S/. 65.90</h5>
                    </div>

                    <div className="planes__main__item__content__foot">
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(true)
                          setDataPlan({ nombre: 'Plan Premium', tiempo: '1 mes', precio: 65.90 })
                        }}
                        className="btn2"
                      >
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
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(true)
                          setDataPlan({ nombre: 'Plan Premium', tiempo: '3 meses', precio: 197.90 })
                        }}
                        className="btn2"
                      >
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
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(true)
                          setDataPlan({ nombre: 'Plan Premium', tiempo: '6 meses', precio: 390.90 })
                        }}
                        className="btn2"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </section>
      {open && <FormData open={open} plan={dataplan} setOpen={setOpen}/>}
    </>
  )
}
