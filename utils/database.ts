import { Db, MongoClient } from 'mongodb'

interface IConnect {
  db: Db
  client: MongoClient
}

const client = new MongoClient(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const connect = async (): Promise<IConnect> => {
  if (!client.isConnected()) await client.connect()

  const db = client.db('MyRaces')
  return { db, client }
}

export default connect
