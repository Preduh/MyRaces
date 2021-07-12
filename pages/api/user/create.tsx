import { NextApiRequest, NextApiResponse } from 'next'
import connect from '../../../utils/database'
import bcrypt from 'bcrypt'

interface IResponseError {
  error: string
}

interface IResponseSucess {
  message: string
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse<IResponseSucess | IResponseError>
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

      await db.collection('users').insertOne({
        username,
        email,
        password: encyiptedPassword
      })

      return response.status(201).json({
        message:
          'Conta criada com sucesso, você será redirecionado para a página de login'
      })
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
