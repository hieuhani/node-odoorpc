import axios from 'axios'

export default class Request {
  private baseUri: string
  private request: any

  constructor(baseUri: string, sessionId?: string) {
    this.baseUri = baseUri
    const config: { [key: string]: any } = {
      headers: {},
    }
    if (sessionId) {
      config.headers['X-Openerp-Session-Id'] = sessionId
    }
    const axiosInstance = axios.create(config)
    this.request = axiosInstance.post
  }

  public execute(uri: string, payload?: { [key: string]: any }) {
    return this.request(this.requestUri(uri), payload || {})
  }

  private decorateRequest(params: { [key: string]: any}) {
    return {
      jsonrpc: '2.0',
      method: 'call',
      params,
    }
  }

  private requestUri(path: string) {
    return `${this.baseUri}/${path}`
  }
}
