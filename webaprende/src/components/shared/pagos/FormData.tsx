import React, {
  useEffect,
  type FC,
  useState,
  type Dispatch,
  type SetStateAction
} from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { IoClose, IoPricetagOutline } from 'react-icons/io5'
import { Wallet, initMercadoPago } from '@mercadopago/sdk-react'
import { type planValues } from '../Interfaces'
import useAuth from '../../../hooks/useAuth'
import { Global } from '../../../helper/Global'
import { useFormik } from 'formik'
import axios from 'axios'
import { SchemaCompras } from '../Schemas'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid'
import CryptoJS from 'crypto-js'
import { Errors } from '../Errors'
import { FaAngleLeft } from 'react-icons/fa6'
const encryptionKey = 'qwerasd159'

interface FormDataProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  plan: planValues | null
}

const FormData: FC<FormDataProps> = ({ open, setOpen, plan }) => {
  const [customization, setCustomization] = useState<any>(null)
  const [preferenceId, setPreferenceId] = useState('')
  const { auth } = useAuth()
  const tokenUser = localStorage.getItem('tokenUser')
  const [habilitarCel, setHabilitarCel] = useState(false)
  const [loadingCorreo, setLoadingCorreo] = useState(false)
  const [estado, setEstado] = useState(0)
  const currentDomain = window.location.origin

  const handleClickPagar = async (): Promise<void> => {
    setLoadingCorreo(true)
    const uniqueId: string = uuidv4()
    const plandata = {
      plan: plan?.nombre,
      tiempo: plan?.tiempo
    }
    try {
      const preferenceData = {
        items: [
          {
            id: `${uniqueId}_${plan?.nombre ?? ''}`,
            title: `${plan?.nombre ?? ''} ${plan?.tiempo ?? ''}`,
            unit_price: plan?.precio,
            quantity: 1,
            description: plandata
          }
        ],
        payment_methods: {
          installments: 1,
          excluded_payment_types: [
            {
              id: 'ticket'
            },
            {
              id: 'atm'
            }
          ]
        },
        statement_descriptor: 'APRENDE EN UN CLICK',
        payer: {
          name: values.nombres,
          surname: values.apellidos,
          email: values.email,
          phone: {
            area_code: '51',
            number: values.celular
          },
          address: {
            street_name: values.email,
            street_number: 123,
            zip_code: '06233200'
          }
        },
        back_urls: {
          success: `${currentDomain}/success/${String(uniqueId)}`,
          failure: `${currentDomain}/error-pago`
        },
        metadata: {
          comment: uniqueId
        },
        external_reference: auth.id ? auth.id : 'notiene',
        auto_return: 'approved',
        notification_url:
          'https://apiaprende.logosperu.com.pe/public/api/webhook'
      }
      const response = await axios.post(
        'https://api.mercadopago.com/checkout/preferences',
        preferenceData,
        {
          headers: {
            Authorization:
              'Bearer APP_USR-4060146089551839-121614-4284ef5806d53191893da445fd7d0662-1596895136',
            'Content-Type': 'application/json'
          }
        }
      )
      const preferenceId: string = response.data.id
      setPreferenceId(preferenceId)
      const dataArray = []
      const dataObject = {
        id_unique: uniqueId
      }
      dataArray.push(dataObject)
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(dataArray),
        encryptionKey
      ).toString()
      localStorage.setItem('data', encryptedData)
      setEstado(1)
    } catch (error) {
      console.error('Error al generar la preferencia de pago:', error)
    }
    setLoadingCorreo(false)
  }

  const validarCorreo = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/validarCorreo/${values.email}`,
      {
        headers: {
          Authorization: `Bearer ${tokenUser ?? ''}`
        }
      }
    )
    if (request.data.existe && !auth.id) {
      Swal.fire({
        title:
          'Ya existe una cuenta con este correo por favor inicie sesion para continuar con su compra',
        icon: 'warning',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: `
          <a href='/login' className="">Iniciar Sesión</a> 
        `,
        confirmButtonAriaLabel: 'Thumbs up, great!',
        cancelButtonText: `
        <p >Cancelar</p> 
        `,
        cancelButtonAriaLabel: 'Thumbs down'
      })
    } else {
      //   const nombresCursosComprados = validarCursoComprado(String(curso?.id))
      //   if (nombresCursosComprados) {
      //     // Mostrar mensaje con los nombres de los cursos ya comprados
      //     // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      //     const listaHtmlCursos = `<li style="margin-top: 10px; font-weight: 700;">- ${curso?.nombre}</li>`
      //     Swal.fire({
      //       title: 'Curso ya adquirido',
      //       html: `Ya has comprado el siguiente curso:<ul style="margin-left: 20px;">${listaHtmlCursos}</ul>`,
      //       icon: 'info'
      //     })
      //   } else {
      handleClickPagar()
      //   }
    }
  }

  const getData = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/perfilEstudiante`, {
      headers: {
        Authorization: `Bearer ${tokenUser ?? ''}`
      }
    })
    setValues({
      ...values,
      nombres: request.data.user.nombres,
      apellidos: request.data.user.apellidos,
      celular: request.data.user.celular,
      email: request.data.user.email
    })
    if (request.data.user.celular) {
      setHabilitarCel(true)
    }
  }

  const {
    handleSubmit,
    handleChange,
    setValues,
    errors,
    values,
    touched,
    handleBlur,
    isSubmitting
  } = useFormik({
    initialValues: {
      nombres: '',
      apellidos: '',
      celular: '',
      email: ''
    },
    validationSchema: SchemaCompras,
    onSubmit: validarCorreo
  })

  useEffect(() => {
    initMercadoPago('APP_USR-cd12f6cc-af2f-4e4b-bcd8-a5c09a43696a', {
      locale: 'es-PE'
    })
    const walletCustomization = {
      texts: {
        action: 'pay',
        valueProp: 'security_safety'
      }
    }
    setCustomization(walletCustomization)
  }, [])

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  useEffect(() => {
    getData()
  }, [auth.id])

  return (
    <React.Fragment>
      <Dialog open={open} className="dialog_pago">
        <DialogContent>
          {estado == 0
            ? (
            <div className="p-8 py-12 pt-20 relative">
              <button
                type="button"
                className="absolute top-4 right-2"
                onClick={() => {
                  setOpen(false)
                }}
              >
                <IoClose className="text-5xl text-[#B43A34]" />
              </button>

              <form action="" className="px-6" onSubmit={handleSubmit}>
                <div className="flex gap-6 justify-between items-center border px-6 py-4 mb-12 rounded-md bg-[#f9f9f9] ">
                  <div className="flex gap-4 items-center">
                    <span className="w-[40px] h-[40px] rounded-full bg-[#b43a34c2] flex items-center justify-center">
                      <IoPricetagOutline className="text-4xl text-white" />
                    </span>
                    <p className="text-4xl text-[#202020] tracking-wide">
                      {plan?.nombre} - {plan?.tiempo}
                    </p>
                  </div>
                  <span className="text-4xl font-bold text-[#B43A34]">
                    S/. {plan?.precio?.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-6">
                  <div className="input-group w-1/2 relative">
                    <label className="label">Nombres</label>
                    <input
                      type="text"
                      className={`${auth.onlyname ? 'bg-gray-200' : ''} input`}
                      disabled={!!auth.onlyname}
                      name="nombres"
                      value={values.nombres}
                      autoComplete="off"
                      onChange={auth.onlyname ? undefined : handleChange}
                      onBlur={handleBlur}
                    />
                    <Errors errors={errors.nombres} touched={touched.nombres} />
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="input-group w-1/2">
                    <label className="label">Apellidos</label>
                    <input
                      type="text"
                      className={`${auth.lastname ? 'bg-gray-200' : ''} input`}
                      name="apellidos"
                      disabled={!!auth.lastname}
                      value={values.apellidos}
                      autoComplete="off"
                      onChange={auth.lastname ? undefined : handleChange}
                      onBlur={handleBlur}
                    />
                    <Errors
                      errors={errors.apellidos}
                      touched={touched.apellidos}
                    />
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="input-group w-1/2">
                    <label className="label">Email</label>
                    <input
                      type="email"
                      className={`${auth.email ? 'bg-gray-200' : ''} input`}
                      name="email"
                      disabled={!!auth.email}
                      value={values.email}
                      autoComplete="off"
                      onChange={auth.email ? undefined : handleChange}
                      onBlur={handleBlur}
                    />
                    <Errors errors={errors.email} touched={touched.email} />
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="input-group w-1/2">
                    <label className="label">Celular</label>
                    <input
                      type="number"
                      className={`${habilitarCel ? 'bg-gray-200' : ''} input`}
                      name="celular"
                      disabled={!!habilitarCel}
                      value={values.celular}
                      autoComplete="off"
                      onChange={habilitarCel ? undefined : handleChange}
                      onBlur={handleBlur}
                    />
                    <Errors errors={errors.celular} touched={touched.celular} />
                  </div>
                </div>
                {!loadingCorreo && !preferenceId
                  ? (
                  <input
                    type="submit"
                    className="bg-[#009EE3] w-fit px-6 mx-auto block py-5 rounded-2xl text-2xl text-white cursor-pointer"
                    value="Continuar con la compra"
                  />
                    )
                  : (
                  <input
                    type="button"
                    className="bg-[#009EE3] w-fit px-6 mx-auto block py-5 rounded-2xl text-2xl text-white"
                    value="Validando..."
                  />
                    )}
              </form>
            </div>
              )
            : (
                estado == 1 &&
            preferenceId && (
              <section>
                <div className="p-8 py-12 pt-20 relative">
                  <button
                    type="button"
                    className="absolute top-4 right-2"
                    onClick={() => {
                      setOpen(false)
                    }}
                  >
                    <IoClose className="text-5xl text-[#B43A34]" />
                  </button>

                  <form action="" className="px-6" onSubmit={handleSubmit}>
                    <div className="flex gap-6 justify-between items-center border px-6 py-4 mb-12 rounded-md bg-[#f9f9f9] ">
                      <div className="flex gap-6 items-center">
                        <span className="w-[40px] h-[40px] rounded-full bg-[#b43a34c2] flex items-center justify-center">
                            <IoPricetagOutline className="text-4xl text-white" />
                        </span>
                        <p className="text-4xl font-bold text-[#202020] tracking-wide">
                        Detalle de compra
                        </p>
                      </div>
                        <span
                            className="text-2xl text-red-500 underline flex gap-0 items-center cursor-pointer"
                            onClick={() => {
                              setPreferenceId('')
                              setEstado(0)
                            }}
                            >
                        <FaAngleLeft className="mt-1" /> Regresar
                        </span>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div className="w-full relative">
                        <label className="label">Nombres</label>
                        <input
                          type="text"
                          className='text-3xl w-full'
                          disabled
                          name="nombres"
                          value={`${values.nombres} ${values.apellidos}`}
                        />
                      </div>
                      <div className="w-full relative">
                        <label className="label">Email</label>
                        <input
                          type="text"
                          className='text-3xl w-full'
                          disabled
                          name="nombres"
                          value={values.email}
                        />
                      </div>
                      <div className="w-full relative">
                        <label className="label">Plan seleccionado</label>
                        <input
                          type="text"
                          className='text-3xl w-full'
                          disabled
                          name="nombres"
                          value={plan?.nombre}
                        />
                      </div>
                      <div className="w-full relative">
                        <label className="label">Tiempo</label>
                        <input
                          type="text"
                          className='text-3xl w-full'
                          disabled
                          name="nombres"
                          value={plan?.tiempo}
                        />
                      </div>
                      <div className="w-full relative">
                        <label className="label">Pago total</label>
                        <input
                          type="text"
                          className='text-3xl w-full'
                          disabled
                          name="nombres"
                          value={`S/. ${(plan?.precio ?? 0)?.toFixed(2)}`}
                        />
                      </div>
                    </div>

                    {!loadingCorreo && preferenceId &&
                      <Wallet
                      initialization={{
                        preferenceId,
                        redirectMode: 'modal'
                      }}
                      customization={customization}
                    />}
                  </form>
                </div>
              </section>
                )
              )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

export default FormData
