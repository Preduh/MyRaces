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
    const { username, password } = request.body

    if (!username || !password) {
      return response.json({ error: 'Username/Password invalid' })
    }

    const { db } = await connect()

    const user: IUser = await db.collection('users').findOne({ username })

    if (user) {
      const passwordIsCorrect = await bcrypt.compare(password, user.password)

      if (passwordIsCorrect) {
        const token = jwt.sign({ user }, process.env.SECRET, {
          expiresIn: 3600
        })

        return response.json({ token })
      } else {
        return response.json({ error: 'Username/Password incorrect' })
      }
    } else {
      return response.json({ error: 'Username/Password incorrect' })
    }
  } else {
    return response.json({ error: 'Wrong request method' })
  }
}
