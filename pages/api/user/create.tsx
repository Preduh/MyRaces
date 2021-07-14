import { NextApiRequest, NextApiResponse } from 'next'
import connect from '../../../utils/database'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface IResponseError {
  error: string
}

interface IUser {
  _id: string
  username: string
  email: string
  password: string
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse<IResponseError | any>
): Promise<void> => {
  if (request.method === 'POST') {
    const { username, password, email } = request.body

    if (!username || !password || !email) {
      return response.json({ error: 'Username/Password/Email invalid' })
    }

    const { db } = await connect()

    const userAlreadyExists = await db.collection('users').findOne({ username })
    const emailAlreadyExists = await db.collection('users').findOne({ email })

    if (!userAlreadyExists && !emailAlreadyExists) {
      const encyiptedPassword = await bcrypt.hash(password, 8)

      const { ops } = await db.collection('users').insertOne({
        username,
        email,
        password: encyiptedPassword
      })

      const user: IUser = ops[0]

      const token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: '1h'
      })

      return response.status(201).json({ token })
    } else if (userAlreadyExists && emailAlreadyExists) {
      return response.json({ error: 'This username and email already exists' })
    } else if (userAlreadyExists && !emailAlreadyExists) {
      return response.json({ error: 'This username already exists' })
    } else if (!userAlreadyExists && emailAlreadyExists) {
      return response.json({ error: 'This email already exists' })
    }
  } else {
    return response.json({ error: 'Wrong request method' })
  }
}
