import styles from '../styles/Home.module.scss'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { parseCookies } from 'nookies'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/authContext'
import Switch from '../components/switchButton'
import { signIn, useSession } from 'next-auth/client'

interface IData {
  username: string
  password: string
  remember: boolean
}

const Home: NextPage = () => {
  const { register, handleSubmit } = useForm()
  const { login } = useContext(AuthContext)
  const [error, setError] = useState('')
  const [session] = useSession()

  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'light')
    } else {
      if (localStorage.getItem('theme') == 'light') {
        setDarkMode(false)
      } else if (localStorage.getItem('theme') == 'dark') {
        setDarkMode(true)
      }
    }
  }, [])

  const handleChange = () => {
    setDarkMode(!darkMode)
    if (darkMode) {
      localStorage.setItem('theme', 'light')
    } else {
      localStorage.setItem('theme', 'dark')
    }
  }

  const handleSignIn = async (userData: IData) => {
    const err = await login(userData)

    setError(err)
  }

  return (
    <div className={darkMode ? styles.pageAuthDark : styles.pageAuth}>
      <aside></aside>
      <main>
        <section>
          <Switch onChange={handleChange} checked={darkMode} />
          <form onSubmit={handleSubmit(handleSignIn)}>
            <h1>
              Entre no <span>MyRaces</span>
            </h1>
            {!session && (
              <button
                type="button"
                className={styles.googleBtn}
                onClick={() =>
                  signIn('google', {
                    callbackUrl: `${process.env.NEXTAUTH_URL}/dashboard`
                  })
                }
              >
                <img src="images/google.svg" />
                <p>Entre com o google</p>
              </button>
            )}
            <input
              {...register('username')}
              type="text"
              placeholder="Nome de usuário"
              name="username"
              autoComplete="off"
              autoCapitalize="off"
              required
            />
            <input
              {...register('password')}
              type="password"
              placeholder="Senha"
              name="password"
              required
            />
            <button type="submit">Entrar</button>
            <div className={styles.connect}>
              <input
                {...register('remember')}
                type="checkbox"
                id="remember"
                name="remember"
              />
              <label htmlFor="remember">Manter-se conectado</label>
            </div>
            <p>
              Não tem conta?
              <Link href="/signup">
                <a>Registre-se</a>
              </Link>
            </p>
            {error && <p className={styles.error}>{error}</p>}
          </form>
        </section>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['myraces.token']: token, [`${process.env.TOKEN_KEY}`]: authToken } =
    parseCookies(ctx)

  if (token || authToken) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
