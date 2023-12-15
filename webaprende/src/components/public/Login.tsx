import { Link, useNavigate } from 'react-router-dom'
import { logo_white } from '../shared/images'
import { useState, useEffect } from 'react'
import Restablecer from './contraseña/Restablecer'
import useAuth from '../../hooks/useAuth'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { Global } from '../../helper/Global'
import { Errors } from '../shared/Errors'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'

const Schema = Yup.object().shape({
  email: Yup.string()
    .email('Email invalido')
    .required('Este campo es requerido'),
  password: Yup.string().required('Este campo es requerido').min(1)
})

interface Values {
  email: string
  password: string
}

export const Login = (): JSX.Element => {
  const { auth, setAuth, loading } = useAuth()
  const [loadingComponents, setLoadingComponents] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [loged, setLoged] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!loading && auth.id) {
      navigate('/aula')
    }
  }, [auth.id, loading])

  const handleOpen = (): void => {
    setOpen(true)
  }

  const validar = async (values: Values): Promise<void> => {
    setLoadingComponents(true)
    const data = new FormData()
    const email = values.email
    const password = values.password
    data.append('email', email)
    data.append('password', password)
    data.append('_method', 'POST')
    try {
      const respuesta = await axios.post(
        `${Global.url}/loginEstudiantes`,
        data
      )
      if (respuesta.data.status == 'success') {
        setLoged('login')
        localStorage.setItem('tokenUser', respuesta.data.acces_token)
        localStorage.setItem(
          'estudiante',
          JSON.stringify({
            id: respuesta.data.user.id,
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            name: `${respuesta.data.user.nombres} ${respuesta.data.user.apellidos}`,
            onlyname: respuesta.data.user.nombres,
            lastname: respuesta.data.user.apellidos,
            email: respuesta.data.user.email,
            idRol: respuesta.data.user.id_rol,
            foto: respuesta.data.user.imagen1,
            portada: respuesta.data.user.imagen2
          })
        )
        setAuth({
          id: respuesta.data.user.id,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          name: `${respuesta.data.user.nombres} ${respuesta.data.user.apellidos}`,
          onlyname: respuesta.data.user.nombres,
          lastname: respuesta.data.user.apellidos,
          email: respuesta.data.user.email,
          idRol: respuesta.data.user.id_rol,
          foto: respuesta.data.user.imagen1,
          portada: respuesta.data.user.imagen2
        })
        setTimeout(() => {
          navigate('/aula', { replace: true })
          // window.location.reload()
        }, 800)
      } else if (respuesta.data.status == 'invalid') {
        setLoged('noexiste')
      } else {
        setLoged('noexiste')
      }
    } catch (error) {
      setLoged('noexiste')
    }
    setLoadingComponents(false)
  }

  const { handleSubmit, handleChange, errors, values, touched, handleBlur } =
    useFormik({
      initialValues: {
        email: '',
        password: ''
      },
      validationSchema: Schema,
      onSubmit: validar
    })

  return (
    <>
      {open && <Restablecer open={open} setOpen={setOpen} />}
      <div className="login">
        <div className="login__title">
          <img src={logo_white} alt="" />
        </div>
        <div className="login__body">
          <div className="login__body__main">
            <h1>Iniciar sesión</h1>
            <div
              className="login__body__main__form"
              style={{ maxWidth: '450px' }}
            >
              <form action="" onSubmit={handleSubmit}>
                <div className="input-group relative">
                  <label className="label">Email </label>
                  <input
                    autoComplete=""
                    name="email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    className="input"
                    type="email"
                  />
                  <Errors errors={errors.email} touched={touched.email} />
                </div>
                <div className="input-group relative">
                  <label className="label">Contraseña</label>
                  <div className="relative">
                    <input
                      autoComplete=""
                      name="password"
                      id="Email"
                      value={values.password}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      className="input"
                      type={showPassword ? 'text' : 'password'}
                    />
                    {showPassword
                      ? (
                      <RiEyeOffLine
                        onClick={() => {
                          setShowPassword(!showPassword)
                        }}
                        className="absolute top-[50%] -translate-y-1/2 right-2 hover:cursor-pointer text-primary text-3xl"
                      />
                        )
                      : (
                      <RiEyeLine
                        onClick={() => {
                          setShowPassword(!showPassword)
                        }}
                        className="absolute top-[50%] -translate-y-1/2 right-2 hover:cursor-pointer text-primary text-3xl"
                        name="password"
                      />
                        )}
                  </div>
                  <Errors errors={errors.password} touched={touched.password} />
                </div>

                <button
                  type="button"
                  className="text-xl text-right underline text-[#27275b] block w-full"
                  onClick={handleOpen}
                >
                  ¿Olvidaste tu contraseña?
                </button>
                <div className="my-0">
                  {loged === 'invalid'
                    ? (
                    <p className="text-red-500 text-2xl">
                      Contraseña incorrecta
                    </p>
                      )
                    : loged === 'noexiste'
                      ? (
                    <p className="text-red-500 text-2xl">Datos incorrectos </p>
                        )
                      : loged === 'login'
                        ? (
                    <p className="text-green-500">
                      Usuario identificado correctamente
                    </p>
                          )
                        : (
                            ''
                          )}
                </div>
                {!loadingComponents
                  ? (
                  <input
                    type="submit"
                    value="Ingresar"
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
            ¿No tienes una cuenta? <Link to="/registro">Regístrate</Link>
          </p>
        </div>
      </div>
    </>
  )
}
