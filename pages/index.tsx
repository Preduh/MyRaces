import styles from '../styles/Home.module.scss'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
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
    session && router.push('/dashboard')
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
                  callbackUrl: `${process.env.NEXTAUTH_URL}/dashboard`
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
  const { ['__Secure-next-auth.session-token']: token } = parseCookies(ctx)

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
