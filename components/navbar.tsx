import { destroyCookie } from 'nookies'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/authContext'
import styles from '../styles/Navbar.module.scss'
import { useSession, signOut } from 'next-auth/client'

interface IProps {
  click: () => void
}

const Navbar = ({ click }: IProps): JSX.Element => {
  const { user } = useContext(AuthContext)
  const [userInfos, setUserInfos] = useState(false)
  const [userImg, setUserImg] = useState('images/user.png')
  const [session] = useSession()

  const capitalize = (name: string) => {
    user.name = name.charAt(0).toUpperCase() + name.slice(1)
  }

  if (user) capitalize(user.name)

  useEffect(() => {
    if (session) {
      setUserImg(session.user.image)
    }
  }, [session])

  const toggleUserInfos = () => {
    setUserInfos(!userInfos)
  }

  const logout = () => {
    signOut({
      callbackUrl: '/'
    })
    destroyCookie(null, 'myraces.token')
  }

  return (
    <nav className={styles.navbar}>
      <button onClick={click} className={styles.menuBtn}>
        <img src="images/menu.png" />
      </button>
      <button className={styles.userBtn} onClick={toggleUserInfos}>
        <img src={userImg} />
      </button>
      <div
        className={styles.userInfos}
        style={userInfos ? { display: 'flex' } : { display: 'none' }}
      >
        <div>
          <h1>{session ? session.user.name : user?.name}</h1>
          <h2>{session ? session.user.email : user?.email}</h2>
        </div>
        <button onClick={logout} className={styles.logoutBtn}>
          Sair
        </button>
      </div>
    </nav>
  )
}

export default Navbar
