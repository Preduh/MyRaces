import styles from '../styles/Home.module.scss'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { parseCookies } from 'nookies'
import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/authContext'

interface IData {
  username: string
  password: string
  remember: boolean
}

const Home: NextPage = () => {
  const { register, handleSubmit } = useForm()
  const { signIn } = useContext(AuthContext)
  const [error, setError] = useState('')

  const handleSignIn = async (userData: IData) => {
    const err = await signIn(userData)

    setError(err)
  }

  return (
    <div className={styles.pageAuth}>
      <aside></aside>
      <main>
        <form onSubmit={handleSubmit(handleSignIn)}>
          <h1>
            Entre no <span>MyRaces</span>
          </h1>
          <input
            {...register('username')}
            type="text"
            placeholder="Nome de usuário"
            autoFocus={true}
            name="username"
            autoComplete="off"
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
          <div className={styles.conect}>
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
      </main>
    </div>
  )
}

export default Home

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
