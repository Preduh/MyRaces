import { NextApiRequest, NextApiResponse } from 'next'
import connect from '../../utils/database'

interface IResponseError {
  error: string
}

interface IResponseSucess {
  username: string
  password: string
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse<IResponseSucess | IResponseError>
): Promise<void> => {
  if (request.method === 'POST') {
    const { username, password } = request.body

    if (!username || !password) {
      return response.status(400).json({ error: 'Username/Password invalid' })
    }

    const { db } = await connect()

    const apiResponse = await db.collection('users').insertOne({
      username,
      password
    })

    return response.status(200).json(apiResponse.ops[0])
  } else {
    return response.status(400).json({ error: 'Wrong request method' })
  }
}
