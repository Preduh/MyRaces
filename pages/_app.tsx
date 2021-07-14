import '../styles/globals.scss'
import { AppProps } from 'next/app'
import { AuthProvider } from '../contexts/authContext'

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
