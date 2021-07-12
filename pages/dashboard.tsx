import { NextPage, GetServerSideProps } from 'next'
import { parseCookies, destroyCookie } from 'nookies'
import { signOut, useSession } from 'next-auth/client'
import styles from '../styles/Dashboard.module.scss'

const Teste: NextPage = () => {
  const [session] = useSession()

  const logout = () => {
    destroyCookie(null, 'TOKEN')
    signOut()
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.user}>
        {session && (
          <>
            <img src={session.user.image} />
            <p>{session.user.email}</p>
            <p>{session.user.name}</p>
          </>
        )}
      </div>
      <button onClick={logout}>Sign out</button>
    </div>
  )
}

export default Teste

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['__Secure.next-auth.session-token']: nextAuthToken } =
    parseCookies(ctx)

  if (!nextAuthToken) {
    const { ['TOKEN']: token } = parseCookies(ctx)

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }
  }

  return {
    props: {}
  }
}
