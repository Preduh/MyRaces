import { NextApiRequest, NextApiResponse } from 'next'
import connect from '../../../utils/database'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

interface IUser {
  _id: string
  username: string
  email: string
}

interface IPayload {
  id: string
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  if (request.method === 'POST') {
    const authHeader = request.headers.authorization

    const token = authHeader.split(' ')[1]

    try {
      const { id } = jwt.decode(token) as IPayload

      if (id.length === 12 || id.length === 24) {
        const { db } = await connect()

        const _id = new ObjectId(id)

        const user: IUser = await db.collection('users').findOne({ _id })

        if (user) {
          return response.json({
            id: user._id,
            name: user.username,
            email: user.email
          })
        } else {
          return response.json({ error: 'User not found' })
        }
      } else {
        return response.json({ error: 'Invalid ID' })
      }
    } catch (err) {
      return response.json({ error: 'Invalid Token' })
    }
  } else {
    return response.json({ error: 'Wrong request method' })
  }
}
