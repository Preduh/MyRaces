import { NextPage, GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { signOut, useSession } from 'next-auth/client'
import styles from '../styles/Dashboard.module.scss'

const Teste: NextPage = () => {
  const [session] = useSession()

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
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}

export default Teste

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['__Secure-next-auth.session-token']: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
