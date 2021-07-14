import styles from '../styles/Home.module.scss'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { parseCookies } from 'nookies'
import { useContext } from 'react'
import { AuthContext } from '../contexts/authContext'

interface IData {
  username: string
  password: string
}

const Home: NextPage = () => {
  const { register, handleSubmit } = useForm()
  const { signIn } = useContext(AuthContext)

  const handleSignIn = async (userData: IData) => {
    await signIn(userData)
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
          <p>
            Não tem conta?
            <Link href="/signup">
              <a>Registre-se</a>
            </Link>
          </p>
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
