import {
  useState,
  useEffect,
  createContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction
} from 'react'
import { Global } from '../helper/Global'
import axios from 'axios'
import { type UserSchema } from './UserSchema'

export interface AuthContextValue {
  auth: typeof UserSchema
  setAuth: Dispatch<SetStateAction<typeof UserSchema>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  title: string
  setTitle: Dispatch<SetStateAction<string>>
  loadingComponents: boolean
  setLoadingComponents: Dispatch<SetStateAction<boolean>>
  token: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({
  children
}: {
  children: ReactNode
}): JSX.Element => {
  const [auth, setAuth] = useState<typeof UserSchema>({
    id: '',
    name: '',
    email: '',
    idRol: null,
    foto: ''
  })
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [token, setToken] = useState<string | null>('')
  const [loadingComponents, setLoadingComponents] = useState(false)

  useEffect(() => {
    authUser()
  }, [])

  const authUser = async (): Promise<void> => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      const respuesta = await axios.get(`${Global.url}/user-profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setAuth({
        id: respuesta.data.user.id,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        name: respuesta.data.user.name,
        email: respuesta.data.user.email,
        idRol: respuesta.data.user.id_rol,
        foto: respuesta.data.user.foto
      })
    }
    setToken(token)
    // SETEAR LOS DATOS
    setLoading(false)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        auth,
        setAuth,
        loading,
        setLoading,
        title,
        setTitle,
        loadingComponents,
        setLoadingComponents
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
