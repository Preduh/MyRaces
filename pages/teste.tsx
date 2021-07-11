import { NextPage } from 'next'
import { signOut } from 'next-auth/client'

const Teste: NextPage = () => {
  return (
    <button
      onClick={() =>
        signOut({
          callbackUrl: 'http://localhost:3000'
        })
      }
    >
      Sign out
    </button>
  )
}

export default Teste
