import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import styles from '../styles/Signup.module.scss'
import { useForm } from 'react-hook-form'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/authContext'
import { parseCookies } from 'nookies'
import Switch from '../components/switchButton'

interface IUserData {
  username: string
  email: string
  password: string
}

const Signup: NextPage = () => {
  const { register, handleSubmit } = useForm()
  const { signUp } = useContext(AuthContext)
  const [error, setError] = useState('')
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

  const handleSignup = async (userData: IUserData) => {
    const err = await signUp(userData)

    setError(err)
  }

  return (
    <div className={darkMode ? styles.signupDark : styles.signup}>
      <aside />
      <main>
        <section>
          <Switch onChange={handleChange} checked={darkMode} />
          <form onSubmit={handleSubmit(handleSignup)}>
            <h1>
              Cadastre-se no <span>MyRaces</span>
            </h1>
            <input
              {...register('username')}
              type="text"
              placeholder="Username"
              name="username"
              autoComplete="off"
              autoCapitalize="off"
              required
            />
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              name="email"
              autoComplete="off"
              autoCapitalize="off"
              required
            />
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              name="password"
              required
            />
            <button type="submit">Criar conta</button>
            <p>
              Já tem uma conta?
              <Link href="/">
                <a>Entre</a>
              </Link>
            </p>
            {error && <p className={styles.error}>{error}</p>}
          </form>
        </section>
      </main>
    </div>
  )
}

export default Signup

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['myraces.token']: token } = parseCookies(ctx)

  if (token) {
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
