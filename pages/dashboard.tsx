import { NextPage, GetServerSideProps } from 'next'
import { destroyCookie, parseCookies } from 'nookies'
import { useState } from 'react'

import { getApiClient } from '../utils/axios'
import styles from '../styles/Dashboard.module.scss'
import Navbar from '../components/navbar'
import Sidebar from '../components/sidebar'

const Dashboard: NextPage = () => {
  const [sidebar, setSidebar] = useState(false)

  const showSidebar = () => {
    setSidebar(!sidebar)
  }

  return (
    <>
      <Sidebar className={sidebar ? styles.sidebar : styles.hiddenSidebar} />
      <Navbar click={showSidebar} />
      <div className={sidebar ? styles.shadow : ''} onClick={showSidebar} />
      <div className={styles.dashboard}>
        <div className={styles.content} />
      </div>
    </>
  )
}

export default Dashboard

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['myraces.token']: token, [`${process.env.TOKEN_KEY}`]: authToken } =
    parseCookies(ctx)

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

  if (!(token || authToken)) {
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
