import { NextPage, GetServerSideProps } from 'next'
import { parseCookies, destroyCookie } from 'nookies'
import { useContext, useState } from 'react'
import router from 'next/router'

import { AuthContext } from '../contexts/authContext'
import { getApiClient } from '../utils/axios'
import styles from '../styles/Dashboard.module.scss'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'

const Dashboard: NextPage = () => {
  const { user } = useContext(AuthContext)
  const [sidebar, setSidebar] = useState(false)

  const showSidebar = () => {
    setSidebar(!sidebar)
  }

  const logout = () => {
    destroyCookie(null, 'myraces.token')
    router.push('/')
  }

  return (
    <>
      <Sidebar className={sidebar ? styles.sidebar : styles.hiddenSidebar} />
      <Navbar click={showSidebar} />
      <div className={styles.dashboard}>
        <div className={styles.content}>
          <div className={styles.user}>
            {user && (
              <>
                <h1>{user.name}</h1>
                <h2>{user.email}</h2>
              </>
            )}
            <button onClick={logout}>Sign out</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['myraces.token']: token } = parseCookies(ctx)

  if (token) {
    const apiClient = getApiClient(ctx)
    const { data } = await apiClient.post('api/user/me', { token })

    if (data.error) {
      destroyCookie(ctx, 'myraces.token')
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }
  }

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
