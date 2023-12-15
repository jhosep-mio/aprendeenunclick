import { useEffect, useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import { type perfilValues } from '../../shared/Interfaces'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import Swal from 'sweetalert2'
import { useFormik } from 'formik'
import { SchemaPerfil } from '../../shared/Schemas'
import { Errors } from '../../shared/Errors'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import UpadateFoto from './perfilComponents/UpadateFoto'

const Perfil = (): JSX.Element => {
  const { auth, setAuth, token } = useAuth()

  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState('')
  const [fotoPerfil, setfotoPerfil] = useState('')

  const savePreventa = async (values: perfilValues): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('nombres', values.nombres)
    data.append('apellidos', values.apellidos)
    if (phone.length > 3) {
      data.append('celular', phone)
    }
    data.append('edad', values.edad)
    data.append('cumpleaños', values.cumpleaños)
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateData/${auth.id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (respuesta.data.status == 'success') {
        Swal.fire('Información actualizada', '', 'success')
        getOneBrief()
      } else {
        Swal.fire('Error al actualizar tu información', '', 'error')
      }
    } catch (error) {
      Swal.fire('Error al actualizar tu información', '', 'error')
    }
    setLoading(false)
  }

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
      nombres: '',
      apellidos: '',
      celular: '',
      edad: '',
      cumpleaños: ''
    },
    validationSchema: SchemaPerfil,
    onSubmit: savePreventa
  })

  const getOneBrief = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/perfilEstudiante`, {
      headers: {
        Authorization: `Bearer ${token ?? ''}`
      }
    })
    setfotoPerfil(request.data.user.imagen1)
    setValues({
      ...values,
      nombres: request.data.user.nombres,
      apellidos: request.data.user.apellidos,
      edad: request.data.user.edad,
      cumpleaños: request.data.user.cumpleaños
    })
    if (request.data.user.celular) {
      setPhone(request.data.user.celular)
    }
    setAuth({
      id: request.data.user.id,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      name: `${request.data.user.nombres} ${request.data.user.apellidos}`,
      onlyname: request.data.user.nombres,
      lastname: request.data.user.apellidos,
      email: request.data.user.email,
      idRol: request.data.user.id_rol,
      foto: request.data.user.imagen1,
      portada: ''
    })
    setLoading(false)
  }

  const handleChangeFotoPerfil = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    e.preventDefault()
    const file = e.target.files?.[0]
    if (file) {
      setLoading(true)
      guardarFotoPerfil(file)
      setLoading(false)
    }
    e.target.value = ''
  }

  const guardarFotoPerfil = async (file: File): Promise<void> => {
    const data = new FormData()
    data.append('imagen1', file)
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
            `${Global.url}/updateFotoPerfil/${auth.id ?? ''}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${
                  token !== null && token !== '' ? token : ''
                }`
              }
            }
      )
      if (respuesta.data.status == 'success') {
        // Swal.fire('Foto de perfil actualizada', '', 'success')
        getOneBrief()
      } else {
        Swal.fire('Error al actualizar tu foto', '', 'warning')
      }
    } catch (error) {
      Swal.fire('Error al actualizar tu foto', '', 'warning')
    }
  }

  useEffect(() => {
    getOneBrief()
  }, [auth.id])

  return (
    <section className="perfil min-h-[100vh]">
      <div className="perfil__main">
        <form className="py-10 flex flex-col gap-12" onSubmit={handleSubmit}>
          <div className="flex w-full gap-16">
            <div className="w-1/2 flex flex-col gap-2 relative">
              <label className="usernamelabel label">Nombres</label>
              <input
                type="text"
                placeholder=""
                id="usernameField"
                name="nombres"
                value={values.nombres}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.nombres} touched={touched.nombres} />
            </div>
            <div className="w-1/2 flex flex-col gap-2">
              <label className="usernamelabel label">Apellidos</label>
              <input
                type="text"
                placeholder=""
                id="usernameField"
                name="apellidos"
                value={values.apellidos}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.apellidos} touched={touched.apellidos} />
            </div>
          </div>
          <div className="flex w-full gap-16">
            <div className="w-1/2 flex flex-col gap-2">
              <label className="usernamelabel label">Email</label>
              <input
                type="email"
                placeholder=""
                id="usernameField"
                value={auth.email}
                disabled
              />
            </div>
            <div className="w-1/2 flex flex-col gap-2 phone_input_perfil relative">
              <label className="usernamelabel label">Celular</label>
              <PhoneInput
                country={'pe'}
                value={phone}
                onChange={(phone) => {
                  setPhone(phone)
                }}
              />
            </div>
          </div>
          <div className="flex w-full gap-16">
            <div className="w-1/2 flex flex-col gap-2">
              <label className="usernamelabel label">Edad</label>
              <input
                type="text"
                placeholder=""
                id="usernameField"
                name="edad"
                value={values.edad}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.edad} touched={touched.edad} />
            </div>
            <div className="w-1/2 flex flex-col gap-2 relative">
              <label className="usernamelabel label">Fecha de nacimiento</label>
              <input
                type="date"
                placeholder=""
                id="usernameField"
                name="cumpleaños"
                value={values.cumpleaños}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors errors={errors.cumpleaños} touched={touched.cumpleaños} />
            </div>
          </div>
          <button
            type={`${!loading ? 'submit' : 'button'}`}
            disabled={loading}
            className="bg-[#8686ff] hover:bg-[#7373dc] transition-colors rounded-lg p-4 mx-auto text-white block px-20 mt-20 text-3xl font-semibold"
          >
            Editar
          </button>
        </form>
      </div>
      <div className="perfil__card">
        <UpadateFoto fotoperfil={fotoPerfil} handleChangeFotoPerfil={handleChangeFotoPerfil}/>
      </div>
    </section>
  )
}

export default Perfil
