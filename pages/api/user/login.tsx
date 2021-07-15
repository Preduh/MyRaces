import { NextApiRequest, NextApiResponse } from 'next'
import connect from '../../../utils/database'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface IUser {
  _id: string
  username: string
  email: string
  password: string
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  if (request.method === 'POST') {
    const { username, password, remember } = request.body

    if (!username || !password) {
      return response.json({ error: 'Nome de usuário/Senha invalidos' })
    }

    const { db } = await connect()

    const user: IUser = await db.collection('users').findOne({ username })

    if (user) {
      const passwordIsCorrect = await bcrypt.compare(password, user.password)

      if (passwordIsCorrect) {
        const token = jwt.sign({ id: user._id }, process.env.SECRET, {
          expiresIn: remember ? '3d' : '1h'
        })

        return response.json({
          token,
          user: {
            id: user._id,
            name: user.username,
            email: user.email
          }
        })
      } else {
        return response.json({ error: 'Nome de usuário/Senha incorretos' })
      }
    } else {
      return response.json({ error: 'Nome de usuário/Senha incorretos' })
    }
  } else {
    return response.json({ error: 'Wrong request method' })
  }
}
