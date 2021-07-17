import styles from '../styles/Navbar.module.scss'

interface IProps {
  click: () => void
}

const Navbar = ({ click }: IProps): JSX.Element => {
  return (
    <nav className={styles.navbar}>
      <button onClick={click}>
        <img src="images/menu.png" />
      </button>
    </nav>
  )
}

export default Navbar
