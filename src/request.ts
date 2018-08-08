import axios, { AxiosInstance } from 'axios'
import { ServerResponse } from './types'

export default class Request {
  private request?: (uri: string, payload: any) => Promise<ServerResponse>
  private axiosInstance: AxiosInstance
  private getSessionId: () => Promise<string>
  private initialized: boolean

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

    this.getSessionId = getSessionId
    this.axiosInstance = axios.create(config)

    this.request = async (uri: string, payload?: { [key: string]: any }) => {
      await this.initDefaultHeader()
      return this.axiosInstance.post(uri, payload)
    }
  }

  public execute(uri: string, payload?: { [key: string]: any }): Promise<ServerResponse> {
    return this.request(uri, payload || {})
  }

  public async fetch(options: any) {
    await this.initDefaultHeader()
    return this.axiosInstance(options)
  }

  public rpc(route: string, params: any, options?: any): Promise<ServerResponse> {
    const data = this.decorateBody('call', params)
    return this.execute(route, data)
  }

  private async initDefaultHeader() {
    if (!this.initialized) {
      const sessionId = await this.getSessionId()
      if (sessionId) {
        this.axiosInstance.defaults.headers.common['X-Openerp-Session-Id'] = sessionId
      }
      this.initialized = true
    } 
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
