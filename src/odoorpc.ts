import {
  OdooRPCConfig,
  OdooRPCOptions,
} from './index'
import Request from './request'

export default class OdooRPC {
  private options: OdooRPCOptions
  private config: OdooRPCConfig
  private request: Request

  constructor(options: OdooRPCOptions, config?: OdooRPCConfig) {
    this.options = options
    this.config = config || {
      tokenKey: 'access_token',
    }
    const port = this.options.port ? `:${this.options.port}` : ''
    this.request = new Request(`${this.options.domain}${port}`, this.sessionId)
  }

  get sessionId(): string {
    return '756faece4f44c9b0e2c30445d8dcfd3a321b4c38'
  }

  public exchangeToken(login: string, password: string) {
    return this.request.execute('auth/exchange_token', {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        login,
        password,
      },
    })
  }

  public get() {
    return this.request.execute('web/dataset/call_kw', {
      jsonrpc: '2.0',
      method: 'read',
      params: {
        method: 'read',
        model: 'res.partner',
        args: [4],
        kwargs: {
          fields: ['id', 'name'],
        },
      },
      id: Math.floor(Math.random() * 1000 * 1000 * 1000),
    })
  }
}
