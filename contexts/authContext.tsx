import {
  createContext,
  ReactChild,
  ReactChildren,
  useEffect,
  useState
} from 'react'
import { setCookie, parseCookies } from 'nookies'
import router from 'next/router'
import { api } from '../utils/api'

interface AuxProps {
  children: ReactChild | ReactChildren
}

interface IUser {
  id: string
  name: string
  email: string
}

interface IUserDataSignIn {
  username: string
  password: string
  remember: boolean
}

interface IUserDataSignUp {
  username: string
  email: string
  password: string
}

interface IAuthContext {
  isAuthenticated: boolean
  user: IUser
  login: (data: IUserDataSignIn) => Promise<string>
  signUp: (data: IUserDataSignUp) => Promise<string>
}

export const AuthContext = createContext({} as IAuthContext)

export function AuthProvider({ children }: AuxProps): JSX.Element {
  const [user, setUser] = useState<IUser | null>(null)

  const isAuthenticated = !!user

  useEffect(() => {
    const { ['myraces.token']: token } = parseCookies()

    if (token) {
      api.post('api/user/me', { token }).then(({ data }) => {
        setUser(data)
      })
    }
  }, [])

  const login = async ({ username, password, remember }: IUserDataSignIn) => {
    const { data } = await api.post('/api/user/login', {
      username,
      password,
      remember
    })

    if (!data.error) {
      const token: string = data.token
      const user = data.user

      api.defaults.headers['Authorization'] = token

      setCookie(undefined, 'myraces.token', token, {
        maxAge: 60 * 60 * 24 * 3 // 1 hour
      })

      setUser(user)

      router.push('/dashboard')
    } else {
      return data.error
    }
  }

  const signUp = async ({ username, email, password }: IUserDataSignUp) => {
    const { data } = await api.post('/api/user/create', {
      username,
      email,
      password
    })

    if (!data.error) {
      const token: string = data.token
      const user = data.user

      api.defaults.headers['Authorization'] = token

      setCookie(undefined, 'myraces.token', token, {
        maxAge: 60 * 60 * 24 * 3 // 1 hour
      })

      setUser(user)

      router.push('/dashboard')
    } else {
      return data.error
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}
