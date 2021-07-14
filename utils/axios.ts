import axios, { AxiosInstance } from 'axios'
import { parseCookies } from 'nookies'
import * as next from 'next'

export function getApiClient(
  ctx?: Pick<next.NextPageContext, 'req'>
): AxiosInstance {
  const { ['myraces.token']: token } = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'http://localhost:3000/'
  })

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`
  }

  return api
}
