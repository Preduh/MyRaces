import styles from '../styles/Home.module.scss'
import { NextPage } from 'next'
import { useForm } from 'react-hook-form'

interface IData {
  username: string
  password: string
}

const Home: NextPage = () => {
  const { register, handleSubmit } = useForm()

  const handleSignIn = (data: IData) => {
    console.log(data)
  }

  return (
    <div className={styles.pageAuth}>
      <aside></aside>
      <main>
        <form onSubmit={handleSubmit(handleSignIn)}>
          <h1>
            Entre em <span>MyRaces</span>
          </h1>
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
