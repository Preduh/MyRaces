import styles from '../styles/Home.module.scss'
import { GetServerSideProps, NextPage } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { signIn, useSession } from 'next-auth/client'
import { parseCookies } from 'nookies'

interface IData {
  username: string
  password: string
}

const Home: NextPage = () => {
  const router = useRouter()

  const { register, handleSubmit } = useForm()
  const [session] = useSession()

  const handleSignIn = (data: IData) => {
    console.log(data)
  }

  useEffect(() => {
    session && router.push('/teste')
  }, [session])

  return (
    <div className={styles.pageAuth}>
      <aside></aside>
      <main>
        <form onSubmit={handleSubmit(handleSignIn)}>
          <h1>
            Entre em <span>MyRaces</span>
          </h1>
          {!session && (
            <button
              onClick={() =>
                signIn('google', {
                  callbackUrl: 'http://localhost:3000/teste'
                })
              }
              id={styles.googleBtn}
            >
              <img src="/images/google.png" />
            </button>
          )}
          <label>ou use seu nome de usuário</label>
          <input
            {...register('username')}
            type="text"
            placeholder="Nome de usuário"
            autoFocus={true}
            name="username"
            autoComplete="off"
          />
          <input
            {...register('password')}
            type="password"
            placeholder="Senha"
            name="password"
          />
          <button type="submit">Entrar</button>
        </form>
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['next-auth.session-token']: token } = parseCookies(ctx)

  if (token) {
    return {
      redirect: {
        destination: '/teste',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
