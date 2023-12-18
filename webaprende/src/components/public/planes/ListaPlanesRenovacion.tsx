import { useEffect, useState } from 'react'
import FormData from '../../shared/pagos/FormData'
import { motion, AnimatePresence } from 'framer-motion'
import { type miplanValues, type planValues } from '../../shared/Interfaces'
import Swal from 'sweetalert2'

export const ListaplanesRenovacion = ({
  miplan
}: {
  miplan: miplanValues | null
}): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [dataplan, setDataPlan] = useState<null | planValues>(null)
  const [plan, setPlan] = useState(0)
  const variants = {
    open: { left: '0' },
    closed: { left: '50%' }
  }

  useEffect(() => {
    setPlan(
      JSON.parse(miplan?.description ?? '').plan == 'Plan Basico' ? 0 : 1
    )
  }, [miplan])

  return (
    <>
      <section className="h-screen bg-paleta-900 pt-[184px]" id="planes22">
        <div
          className={`mx-auto relative w-[500px] bg-gray-300 text-center flex items-center justify-center mb-20 transition-all font_main z-[1]
        
        `}
        >
          <motion.span
            animate={plan == 0 ? 'open' : 'closed'}
            variants={variants}
            className="bg-paleta-800 absolute left-0 w-1/2  h-full -z-[1]"
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
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800 text-white">
                  Resolución de problemas
                </li>
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800 text-white">
                  Solo visualiza los temarios
                </li>
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800 text-white">
                  Ingreso a examenes
                </li>
              </motion.ul>
              <motion.div
                initial={{ opacity: 0, display: 'none' }}
                animate={{ opacity: 1, display: 'flex' }}
                exit={{ opacity: 0, display: 'none' }}
                className="planes2__main"
              >
                <div
                  className={`planes2__main__item relative ${
                    JSON.parse(miplan?.description ?? '').plan ==
                      'Plan Basico' &&
                    JSON.parse(miplan?.description ?? '').tiempo == '1 mes'
                      ? 'border_selecter'
                      : ''
                  }`}
                >
                  {JSON.parse(miplan?.description ?? '').plan ==
                    'Plan Basico' &&
                    JSON.parse(miplan?.description ?? '').tiempo == '1 mes' && (
                      <span className="absolute left-0 right-0 top-0 bg-paleta-800 text-white text-3xl w-fit mx-auto px-6 py-2 rounded-b-lg">
                        Plan contratado
                      </span>
                  )}
                  <div className="planes2__main__item__content">
                    <div className="planes2__main__item__content__head">
                      <span>1 mes</span>
                      <h5>S/. 49.90</h5>
                    </div>
                    <div className="planes2__main__item__content__foot">
                      {JSON.parse(miplan?.description ?? '').plan ==
                        'Plan Basico' &&
                      JSON.parse(miplan?.description ?? '').tiempo ==
                        '1 mes'
                        ? (
                        <button
                          type="button"
                          disabled
                          className="btn2 bg_imp"
                        >
                          Elige este plan
                        </button>
                          )
                        : (
                        <button
                          type="button"
                          onClick={() => {
                            if ((JSON.parse(miplan?.description ?? '').plan == 'Plan Basico' && JSON.parse(miplan?.description ?? '').tiempo == '3 meses') || (JSON.parse(miplan?.description ?? '').plan == 'Plan Basico' && JSON.parse(miplan?.description ?? '').tiempo == '6 meses') || (JSON.parse(miplan?.description ?? '').plan == 'Plan Premium' && JSON.parse(miplan?.description ?? '').tiempo == '1 mes') || (JSON.parse(miplan?.description ?? '').plan == 'Plan Premium' && JSON.parse(miplan?.description ?? '').tiempo == '3 meses') || (JSON.parse(miplan?.description ?? '').plan == 'Plan Premium' && JSON.parse(miplan?.description ?? '').tiempo == '6 meses')) {
                              Swal.fire('No puedes adquirir un plan menor al actual', '', 'warning')
                            } else {
                              setOpen(true)
                              setDataPlan({
                                nombre: 'Plan Basico',
                                tiempo: '1 mes',
                                precio: 49.9
                              })
                            }
                          }}
                          className="btn2"
                        >
                          Elige este plan
                        </button>
                          )}
                    </div>
                  </div>
                </div>
                <div
                  className={`planes2__main__item relative ${
                    JSON.parse(miplan?.description ?? '').plan ==
                      'Plan Basico' &&
                    JSON.parse(miplan?.description ?? '').tiempo == '3 meses'
                      ? 'border_selecter'
                      : ''
                  }`}
                >
                  {JSON.parse(miplan?.description ?? '').plan ==
                    'Plan Basico' &&
                    JSON.parse(miplan?.description ?? '').tiempo ==
                      '3 meses' && (
                      <span className="absolute left-0 right-0 top-0 bg-paleta-800 text-white text-3xl w-fit mx-auto px-6 py-2 rounded-b-lg">
                        Plan contratado
                      </span>
                  )}
                  <div className="planes2__main__item__content">
                    <div className="planes2__main__item__content__head">
                      <span>3 Meses</span>
                      <h5>S/. 140.90</h5>
                    </div>
                    <div className="planes2__main__item__content__foot">
                      {JSON.parse(miplan?.description ?? '').plan ==
                        'Plan Basico' &&
                      JSON.parse(miplan?.description ?? '').tiempo ==
                        '3 meses'
                        ? (
                        <button type="button" disabled className="btn2 bg_imp">
                          Elige este plan
                        </button>
                          )
                        : (
                        <button
                          type="button"
                          onClick={() => {
                            if ((JSON.parse(miplan?.description ?? '').plan == 'Plan Basico' && JSON.parse(miplan?.description ?? '').tiempo == '3 meses') || (JSON.parse(miplan?.description ?? '').plan == 'Plan Basico' && JSON.parse(miplan?.description ?? '').tiempo == '6 meses') || (JSON.parse(miplan?.description ?? '').plan == 'Plan Premium' && JSON.parse(miplan?.description ?? '').tiempo == '1 mes') || (JSON.parse(miplan?.description ?? '').plan == 'Plan Premium' && JSON.parse(miplan?.description ?? '').tiempo == '3 meses') || (JSON.parse(miplan?.description ?? '').plan == 'Plan Premium' && JSON.parse(miplan?.description ?? '').tiempo == '6 meses')) {
                              Swal.fire('No puedes adquirir un plan menor al actual', '', 'warning')
                            } else {
                              setOpen(true)
                              setDataPlan({
                                nombre: 'Plan Basico',
                                tiempo: '3 meses',
                                precio: 140.9
                              })
                            }
                          }}
                          className="btn2"
                        >
                          Elige este plan
                        </button>
                          )}
                    </div>
                  </div>
                </div>
                <div
                  className={`planes2__main__item relative ${
                    JSON.parse(miplan?.description ?? '').plan ==
                      'Plan Basico' &&
                    JSON.parse(miplan?.description ?? '').tiempo == '6 meses'
                      ? 'border_selecter'
                      : ''
                  }`}
                >
                  {JSON.parse(miplan?.description ?? '').plan ==
                    'Plan Basico' &&
                    JSON.parse(miplan?.description ?? '').tiempo ==
                      '6 meses' && (
                      <span className="absolute left-0 right-0 top-0 bg-paleta-800 text-white text-3xl w-fit mx-auto px-6 py-2 rounded-b-lg">
                        Plan contratado
                      </span>
                  )}
                  <div className="planes2__main__item__content">
                    <div className="planes2__main__item__content__head">
                      <span>6 meses</span>
                      <h5>S/. 280.90</h5>
                    </div>
                    <div className="planes2__main__item__content__foot">
                      {JSON.parse(miplan?.description ?? '').plan ==
                        'Plan Basico' &&
                      JSON.parse(miplan?.description ?? '').tiempo ==
                        '6 meses'
                        ? (
                        <button
                          type="button"
                          className="btn2 bg_imp"
                        >
                          Elige este plan
                        </button>
                          )
                        : (
                        <button
                          type="button"
                          onClick={() => {
                            if ((JSON.parse(miplan?.description ?? '').plan == 'Plan Premium' && JSON.parse(miplan?.description ?? '').tiempo == '1 mes') || (JSON.parse(miplan?.description ?? '').plan == 'Plan Premium' && JSON.parse(miplan?.description ?? '').tiempo == '3 meses') || (JSON.parse(miplan?.description ?? '').plan == 'Plan Premium' && JSON.parse(miplan?.description ?? '').tiempo == '6 meses')) {
                              Swal.fire('No puedes adquirir un plan menor al actual', '', 'warning')
                            } else {
                              setOpen(true)
                              setDataPlan({
                                nombre: 'Plan Basico',
                                tiempo: '6 meses',
                                precio: 280.9
                              })
                            }
                          }}
                          className="btn2"
                        >
                          Elige este plan
                        </button>
                          )}
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
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800 text-white ">
                  Clases interactivas
                </li>
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800 text-white">
                  Clasificacion segun rendimiento
                </li>
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800 text-white">
                  Seguimiento de avances
                </li>
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800 text-white">
                  Acessos para el padre de familia
                </li>
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800 text-white">
                  Resolución de problemas
                </li>
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800 text-white">
                  Solo visualiza los temarios
                </li>
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800 text-white">
                  Ingreso a examenes
                </li>
                <li className="text-3xl mb-2 marker:bg-paleta-800 marker:text-paleta-800 text-white">
                  Control de progreso
                </li>
              </motion.ul>
              <motion.div
                initial={{ opacity: 0, display: 'none' }}
                animate={{ opacity: 1, display: 'flex' }}
                exit={{ opacity: 0, display: 'none' }}
                className="planes2__main"
              >
                <div
                  className={`planes2__main__item relative ${
                    JSON.parse(miplan?.description ?? '').plan ==
                      'Plan Premium' &&
                    JSON.parse(miplan?.description ?? '').tiempo == '1 mes'
                      ? 'border_selecter'
                      : ''
                  }`}
                >
                  {JSON.parse(miplan?.description ?? '').plan ==
                    'Plan Premium' &&
                    JSON.parse(miplan?.description ?? '').tiempo == '1 mes' && (
                      <span className="absolute left-0 right-0 top-0 bg-paleta-800 text-white text-3xl w-fit mx-auto px-6 py-2 rounded-b-lg">
                        Plan contratado
                      </span>
                  )}
                  <div className="planes2__main__item__content">
                    <div className="planes2__main__item__content__head">
                      <span>1 mes</span>
                      <h5>S/. 65.90</h5>
                    </div>

                    <div className="planes2__main__item__content__foot">
                      {JSON.parse(miplan?.description ?? '').plan ==
                        'Plan Premium' &&
                      JSON.parse(miplan?.description ?? '').tiempo ==
                        '1 mes'
                        ? (
                        <button type="button" disabled className="btn2 bg_imp">
                          Elige este plan
                        </button>
                          )
                        : (
                        <button
                          type="button"
                          onClick={() => {
                            if ((JSON.parse(miplan?.description ?? '').plan == 'Plan Premium' && JSON.parse(miplan?.description ?? '').tiempo == '3 meses') || (JSON.parse(miplan?.description ?? '').plan == 'Plan Premium' && JSON.parse(miplan?.description ?? '').tiempo == '6 meses')) {
                              Swal.fire('No puedes adquirir un plan menor al actual', '', 'warning')
                            } else {
                              setOpen(true)
                              setDataPlan({
                                nombre: 'Plan Premium',
                                tiempo: '1 mes',
                                precio: 65.9
                              })
                            }
                          }}
                          className="btn2"
                        >
                          Elige este plan
                        </button>
                          )}
                    </div>
                  </div>
                </div>
                <div
                  className={`planes2__main__item relative ${
                    JSON.parse(miplan?.description ?? '').plan ==
                      'Plan Premium' &&
                    JSON.parse(miplan?.description ?? '').tiempo == '3 meses'
                      ? 'border_selecter'
                      : ''
                  }`}
                >
                  {JSON.parse(miplan?.description ?? '').plan ==
                    'Plan Premium' &&
                    JSON.parse(miplan?.description ?? '').tiempo ==
                      '3 meses' && (
                      <span className="absolute left-0 right-0 top-0 bg-paleta-800 text-white text-3xl w-fit mx-auto px-6 py-2 rounded-b-lg">
                        Plan contratado
                      </span>
                  )}
                  <div className="planes2__main__item__content">
                    <div className="planes2__main__item__content__head">
                      <span>3 Meses</span>
                      <h5>S/. 197.90</h5>
                    </div>
                    <div className="planes2__main__item__content__foot">
                      {JSON.parse(miplan?.description ?? '').plan ==
                        'Plan Premium' &&
                      JSON.parse(miplan?.description ?? '').tiempo ==
                        '3 meses'
                        ? (
                        <button type="button" disabled className="btn2 bg_imp">
                          Elige este plan
                        </button>
                          )
                        : (
                        <button
                          type="button"
                          onClick={() => {
                            if ((JSON.parse(miplan?.description ?? '').plan == 'Plan Premium' && JSON.parse(miplan?.description ?? '').tiempo == '6 meses')) {
                              Swal.fire('No puedes adquirir un plan menor al actual', '', 'warning')
                            } else {
                              setOpen(true)
                              setDataPlan({
                                nombre: 'Plan Premium',
                                tiempo: '3 meses',
                                precio: 197.9
                              })
                            }
                          }}
                          className="btn2"
                        >
                          Elige este plan
                        </button>
                          )}
                    </div>
                  </div>
                </div>
                <div
                  className={`planes2__main__item relative ${
                    JSON.parse(miplan?.description ?? '').plan ==
                      'Plan Premium' &&
                    JSON.parse(miplan?.description ?? '').tiempo == '6 meses'
                      ? 'border_selecter'
                      : ''
                  }`}
                >
                  {JSON.parse(miplan?.description ?? '').plan ==
                    'Plan Premium' &&
                    JSON.parse(miplan?.description ?? '').tiempo ==
                      '6 meses' && (
                      <span className="absolute left-0 right-0 top-0 bg-paleta-800 text-white text-3xl w-fit mx-auto px-6 py-2 rounded-b-lg">
                        Plan contratado
                      </span>
                  )}
                  <div className="planes2__main__item__content">
                    <div className="planes2__main__item__content__head">
                      <span>6 meses</span>
                      <h5>S/. 390.90</h5>
                    </div>
                    <div className="planes2__main__item__content__foot">

                  {JSON.parse(miplan?.description ?? '').plan ==
                    'Plan Premium' &&
                    JSON.parse(miplan?.description ?? '').tiempo ==
                      '6 meses'
                    ? <button
                        type="button"
                        className="btn2 bg_imp"
                      >
                        Elige este plan
                      </button>
                    : <button
                        type="button"
                        onClick={() => {
                          setOpen(true)
                          setDataPlan({
                            nombre: 'Plan Premium',
                            tiempo: '6 meses',
                            precio: 390.9
                          })
                        }}
                        className="btn2"
                      >
                        Elige este plan
                      </button>}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </section>
      {open && <FormData open={open} plan={dataplan} setOpen={setOpen} />}
    </>
  )
}
