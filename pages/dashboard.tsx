import { NextPage, GetServerSideProps } from 'next'
import { parseCookies, destroyCookie } from 'nookies'
import { signOut, useSession } from 'next-auth/client'
import styles from '../styles/Dashboard.module.scss'
import jwt from 'jsonwebtoken'
import { useEffect, useState } from 'react'

interface IPayload {
  user: {
    _id: string
    username: string
    email: string
  }
}

interface IUser {
  _id: string
  username: string
  email: string
}

const Dashboard: NextPage = () => {
  const [session] = useSession()
  const [userData, setUserData] = useState({} as IUser)

  const { ['TOKEN']: token } = parseCookies()

  useEffect(() => {
    if (token) {
      const payload = jwt.decode(token) as IPayload

      setUserData(payload.user)
    }
  }, [])

  const logout = () => {
    destroyCookie(null, 'TOKEN')
    signOut({ callbackUrl: process.env.NEXTAUTH_URL })
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.user}>
        {session && (
          <>
            <h1>{session.user.name}</h1>
            <h2>{session.user.email}</h2>
          </>
        )}
        {Object.keys(userData).length !== 0 && (
          <>
            <h1>{userData.username}</h1>
            <h2>{userData.email}</h2>
          </>
        )}
      </div>
      <button onClick={logout}>Sign out</button>
    </div>
  )
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['__Secure-next-auth.session-token']: nextAuthToken } =
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
