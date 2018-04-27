import axios from 'axios'
import { ServerResponse } from './types'

export default class Request {
  private request: any

  constructor(baseUri: string, database?: string, getSessionId?: () => Promise<string>) {
    const config: { [key: string]: any } = {
      headers: {
        'Content-Type': 'application/json',
      },
      baseURL: baseUri,
    }

    if (database) {
      config.headers['X-Database-Name'] = database
    }
    const axiosInstance = axios.create(config)
    this.request = async (uri: string, payload?: { [key: string]: any }) => {
      const sessionId = await getSessionId()
      if (sessionId) {
        axiosInstance.defaults.headers.common['X-Openerp-Session-Id'] = sessionId
      }
      return axiosInstance.post(uri, payload)
    }
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
