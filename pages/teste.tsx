import { NextPage, GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import { signOut } from 'next-auth/client'

const Teste: NextPage = () => {
  console.log(process.env.NEXTAUTH_URL)
  return <button onClick={() => signOut()}>Sign out</button>
}

export default Teste

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['next-auth.session-token']: token } = parseCookies(ctx)

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
