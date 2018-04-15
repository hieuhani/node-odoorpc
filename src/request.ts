import axios from 'axios'
import { ServerResponse } from './types'

export default class Request {
  private request: any

  constructor(baseUri: string, sessionId?: string) {
    const config: { [key: string]: any } = {
      headers: {
        'Content-Type': 'application/json',
      },
      baseURL: baseUri,
    }
    if (sessionId) {
      config.headers['X-Openerp-Session-Id'] = sessionId
    }
    const axiosInstance = axios.create(config)
    this.request = axiosInstance.post
  }

  public execute(uri: string, payload?: { [key: string]: any }): Promise<ServerResponse> {
    return this.request(uri, payload || {})
  }

  public rpc(route: string, params: any, options?: any): Promise<ServerResponse> {
    const data = this.decorateBody('call', params)
    return this.execute(route, data)
  }

  private decorateBody(method: string, params: { [key: string]: any}): any {
    return {
      jsonrpc: '2.0',
      method,
      params,
      id: Math.floor(Math.random() * 1000 * 1000 * 1000),
    }
  }
}

export {
  ServerResponse,
}
