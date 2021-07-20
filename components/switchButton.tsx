import styles from '../styles/SwitchButton.module.scss'

interface ISwitch {
  onChange: () => void
  checked: boolean
}

const Switch = ({ onChange, checked }: ISwitch): JSX.Element => {
  return (
    <div className={styles.switch}>
      <input
        type="checkbox"
        className={styles.cbSwitch}
        id="cbSwitch"
        onChange={onChange}
        checked={checked}
      />
      <label htmlFor="cbSwitch" className={styles.container}>
        <div className={styles.circle}></div>
      </label>
      {checked ? (
        <label className={styles.darkLabel}>Dark Mode</label>
      ) : (
        <label className={styles.lightLabel}>Light Mode</label>
      )}
    </div>
  )
}

export default Switch
