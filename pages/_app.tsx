import '../styles/globals.scss'
import { AppProps } from 'next/app'
import { Provider } from 'next-auth/client'

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
