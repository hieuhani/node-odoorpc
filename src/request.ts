import axios from 'axios'

export default class Request {
  private request: any

  constructor(baseUri: string, sessionId?: string) {
    const config: { [key: string]: any } = {
      headers: {},
      baseURL: baseUri,
    }
    if (sessionId) {
      config.headers['X-Openerp-Session-Id'] = sessionId
    }
    const axiosInstance = axios.create(config)
    this.request = axiosInstance.post
  }

  public execute(uri: string, payload?: { [key: string]: any }) {
    return this.request(uri, payload || {})
  }

  private decorateBody(method: string, params: { [key: string]: any}) {
    return {
      jsonrpc: '2.0',
      method,
      params,
      id: Math.floor(Math.random() * 1000 * 1000 * 1000),
    }
  }
}
