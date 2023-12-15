import { Link, useNavigate } from 'react-router-dom'
import { logo_white } from '../shared/images'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useAuth from '../../hooks/useAuth'
import { Global } from '../../helper/Global'
import { type valuesRegistro } from '../shared/Interfaces'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { Errors } from '../shared/Errors'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import { FormCodigo } from './registro/Registro/FormCodigo'

const Schema = Yup.object().shape({
  email: Yup.string()
    .email('Email invalido')
    .required('Este campo es requerido'),
  password: Yup.string()
    .required('Este campo es requerido')
    .min(5, 'Debe tener al menos 5 digitos'),
  celular: Yup.string()
    .required('Este campo es requerido')
    .min(7, 'Ingrese un celular valido'),
  nombres: Yup.string()
    .required('Este campo es requerido')
    .min(3, 'Ingrese un nombre valido'),
  apellidos: Yup.string()
    .required('Este campo es requerido')
    .min(3, 'Ingrese un apellido valido')
})

export const Registro = (): JSX.Element => {
  const { auth, loading } = useAuth()
  const navigate = useNavigate()
  const [loadingComponents, setLoadingComponents] = useState(false)
  const [estado, setEstado] = useState(1)
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!loading && auth.id) {
      navigate('/aula')
    }
  }, [auth.id, loading])

  const enviarCodigo = async (values: valuesRegistro): Promise<void> => {
    setLoadingComponents(true)
    const data = new FormData()
    data.append('correo', values.email)
    try {
      const respuesta = await axios.post(
          `${Global.url}/codigoVerificacion`,
          data
      )
      if (respuesta.data.status === 'success') {
        Swal.fire(
          'Se envio un codigo de verificación a su correo',
          'Revise su bandeja de entrada',
          'success'
        )
        setEstado(1)
      } else if (respuesta.data.status === 'correo') {
        Swal.fire(
          'Ya existe una cuenta asociada a este correo',
          '',
          'warning'
        )
      }
    } catch (error) {
      console.log(error)
      Swal.fire(
        'Se genero un error al intentar registrar la cuenta',
        '',
        'error'
      )
    }
    setLoadingComponents(false)
  }

  useEffect(() => {
    setEstado(0)
  }, [])

  useEffect(() => {
    setValues({
      ...values,
      celular: phone
    })
  }, [phone])

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    setValues
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
      celular: '',
      nombres: '',
      apellidos: ''
    },
    validationSchema: Schema,
    onSubmit: enviarCodigo
  })

  return (
      <>
        <div className="login">
          <div className="login__title">
            <img src={logo_white} alt="" />
          </div>
          {estado == 0
            ? <div className="login__body">
              <div className="login__body__main">
                <h1>Regístrate</h1>
                <div className="login__body__main__form">
                  <form action="" onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="input-group relative">
                        <label className="label">Nombres</label>
                        <input
                          autoComplete=""
                          className="input"
                          type="text"
                          name="nombres"
                          value={values.nombres}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        <Errors
                          errors={errors.nombres}
                          touched={touched.nombres}
                        />
                      </div>
                      <div className="input-group relative">
                        <label className="label">Apellidos</label>
                        <input
                          autoComplete=""
                          className="input"
                          type="text"
                          name="apellidos"
                          value={values.apellidos}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        <Errors
                          errors={errors.apellidos}
                          touched={touched.nombres}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="input-group relative">
                        <label className="label">Correo</label>
                        <input
                          autoComplete=""
                          className="input"
                          type="email"
                          name="email"
                          value={values.email}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        <Errors errors={errors.email} touched={touched.email} />
                      </div>
                      <div className="input-group relative">
                        <label className="label">Celular</label>
                        <PhoneInput
                          country={'pe'}
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-expect-error
                          className="input"
                          value={phone}
                          onChange={(phone) => {
                            setPhone(phone)
                          }}
                        />
                        <Errors
                          errors={errors.celular}
                          touched={touched.celular}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="input-group">
                        <label className="label">Contraseña</label>
                        <input
                          autoComplete=""
                          className="input"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={values.password}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                      </div>
                      {showPassword
                        ? (
                        <RiEyeOffLine
                          onClick={() => {
                            setShowPassword(!showPassword)
                          }}
                          className="absolute top-[40%] -translate-y-1/2 right-2 hover:cursor-pointer text-primary text-3xl"
                        />
                          )
                        : (
                        <RiEyeLine
                          onClick={() => {
                            setShowPassword(!showPassword)
                          }}
                          className="absolute top-[40%] -translate-y-1/2 right-2 hover:cursor-pointer text-primary text-3xl"
                          name="password"
                        />
                          )}
                    </div>
                    <Errors
                      errors={errors.password}
                      touched={touched.password}
                    />
                    {!loadingComponents
                      ? (
                      <input
                        type="submit"
                        value="Registrar"
                        className="btn_login cursor-pointer"
                      />
                        )
                      : (
                      <input
                        type="button"
                        disabled
                        value="Validando..."
                        className="btn_login cursor-pointer"
                      />
                        )}
                  </form>
                </div>
              </div>
              <p className="text_registre">
                ¿Ya tienes una cuenta? <Link to="/login">Ingresar</Link>
              </p>
            </div>
            : (
            <>
              <FormCodigo datos={values} />
            </>
              )}
        </div>
      </>
  )
}
