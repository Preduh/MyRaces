import styles from '../styles/Home.module.scss'
import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { signIn, useSession } from 'next-auth/client'
import { parseCookies, setCookie } from 'nookies'
import axios from 'axios'

interface IData {
  username: string
  password: string
}

const Home: NextPage = () => {
  const router = useRouter()

  const { register, handleSubmit } = useForm()
  const [session] = useSession()

  const handleSignIn = async (userData: IData) => {
    const { data } = await axios.post('/api/user/login', userData)

    if (data.message) {
      setCookie(
        null,
        'TOKEN',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      )
      router.push('/dashboard')
    }
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
            Entre no <span>MyRaces</span>
          </h1>
          {!session && (
            <button
              onClick={() =>
                signIn('google', {
                  callbackUrl: `${process.env.NEXTAUTH_URL}/dashboard`
                })
              }
              id={styles.googleBtn}
              type="button"
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
  const { ['__Secure.next-auth.session-token']: token } = parseCookies(ctx)

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
