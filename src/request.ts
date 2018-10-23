import axios, { AxiosInstance } from 'axios'
import { ServerResponse, AuthResponse } from './types'

export default class Request {
  private request?: (uri: string, payload: any) => Promise<ServerResponse>
  private axiosInstance: AxiosInstance
  private getAuthData: () => Promise<AuthResponse>
  private initialized: boolean

  constructor(baseUri: string, database?: string, getAuthData?: () => Promise<AuthResponse>) {
    const config: { [key: string]: any } = {
      headers: {
        'Content-Type': 'application/json',
      },
      baseURL: baseUri,
    }

    if (database) {
      config.headers['X-Database-Name'] = database
    }

    this.getAuthData = getAuthData
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
      const authData = await this.getAuthData()
      if (authData && authData.session_id) {
        this.axiosInstance.defaults.headers.common['X-Openerp-Session-Id'] = authData.session_id
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
