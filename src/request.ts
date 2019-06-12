import { AuthResponse } from './types'

export default class Request {
  private request?: (uri: string, payload: any) => Promise<any>
  private getAuthData: () => Promise<AuthResponse>
  private initialized: boolean
  private baseUri: string
  private headers: any

  constructor(baseUri: string, database?: string, getAuthData?: () => Promise<AuthResponse>) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    if (database) {
      defaultHeaders['X-Database-Name'] = database
    }
    this.baseUri = baseUri
    this.headers = defaultHeaders

    this.getAuthData = getAuthData

    this.request = async (uri: string, payload?: { [key: string]: any }) => {
      await this.initDefaultHeader()
      return fetch(`${this.baseUri}/${uri}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload),
      })
    }
  }

  public execute(uri: string, payload?: { [key: string]: any }): Promise<any> {
    return this.request(uri, payload || {})
  }

  public async fetch(options: any) {
    if (!options) {
      throw new Error('options must be specified')
    }
    await this.initDefaultHeader()
    if (options.url && options.url.startsWidth('')) {
      options.url = options.url.splice(1)
    }
    return fetch(`${this.baseUri}${options.url}`, {
      method: options.method,
      headers: this.headers,
      body: JSON.stringify(options.data),
    }).then(response => response.json())
  }

  public rpc(route: string, params: any, options?: any): Promise<any> {
    const data = this.decorateBody('call', params)
    return this.execute(route, data)
  }

  private async initDefaultHeader() {
    if (!this.initialized) {
      const authData = await this.getAuthData()
      if (authData && authData.access_token) {
        this.headers['Authentication'] = `Bearer ${authData.access_token}`
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
