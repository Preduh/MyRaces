import { NextPage, GetServerSideProps } from 'next'
import { parseCookies, destroyCookie } from 'nookies'
import styles from '../styles/Dashboard.module.scss'
import { useContext } from 'react'
import router from 'next/router'
import { AuthContext } from '../contexts/authContext'
import { getApiClient } from '../utils/axios'

const Dashboard: NextPage = () => {
  const { user } = useContext(AuthContext)

  const logout = () => {
    destroyCookie(null, 'myraces.token')
    router.push('/')
  }

  return (
    <div className={styles.dashboard}>
      <input
        type="checkbox"
        className={styles.checkboxMenu}
        id="checkboxMenu"
      />
      <label htmlFor="checkboxMenu" className={styles.menuIcon}>
        <img src="/images/menu.png" />
      </label>
      <div className={styles.menu}>
        {user && (
          <section className={styles.userInfos}>
            <img src="images/user.png" id={styles.userImage} />
            <div className={styles.userData}>
              <h1>{user.name}</h1>
            </div>
          </section>
        )}
      </div>
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
