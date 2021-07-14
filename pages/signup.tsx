import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import styles from '../styles/Signup.module.scss'
import { useForm } from 'react-hook-form'
import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/authContext'
import { parseCookies } from 'nookies'

interface IUserData {
  username: string
  email: string
  password: string
}

const Signup: NextPage = () => {
  const { register, handleSubmit } = useForm()
  const { signUp } = useContext(AuthContext)
  const [error, setError] = useState('')

  const handleSignup = async (userData: IUserData) => {
    const err = await signUp(userData)

    setError(err)
  }

  return (
    <div className={styles.signup}>
      <form onSubmit={handleSubmit(handleSignup)}>
        <h1>
          Cadastre-se no <span>MyRaces</span>
        </h1>
        <input
          {...register('username')}
          type="text"
          placeholder="Username"
          name="username"
          required
        />
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          name="email"
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
        <p>{error}</p>
      </form>
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
