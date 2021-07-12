import { NextPage } from 'next'
import Link from 'next/link'
import styles from '../styles/Signup.module.scss'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import router from 'next/router'

interface IUserData {
  username: string
  email: string
  password: string
}

interface IData {
  message: string
  error: string
}

const Signup: NextPage = () => {
  const { register, handleSubmit } = useForm()
  const [msg, setMsg] = useState({} as IData)

  const handleSignup = async (userData: IUserData) => {
    const { data } = await axios.post('/api/user/create', userData)
    setMsg(data)

    if (data.message) {
      setTimeout(() => {
        router.push('/')
      }, 5000)
    }
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
        {msg.error && <p className={styles.errorMsg}>{msg.error}</p>}
        {msg.message && <p className={styles.message}>{msg.message}</p>}
      </form>
    </div>
  )
}

export default Signup
