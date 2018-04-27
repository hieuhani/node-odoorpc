import Request, { ServerResponse } from './request'
import {
  OdooRPCConfig,
  OdooRPCOptions,
  QueryOptions,
  QueryOutput,
} from './types'

export class OdooRPC {
  private options: OdooRPCOptions
  private config: OdooRPCConfig
  private request: Request

  constructor(options: OdooRPCOptions, config?: OdooRPCConfig) {
    this.options = options
    this.config = config
    const port = this.options.port ? `:${this.options.port}` : ''
    this.request = new Request(
      `${this.options.domain}${port}`,
      this.options.database,
      this.getSessionId.bind(this),
    )
  }

  public async getSessionId(): Promise<string> {
    return this.config.storage.getItem(this.config.tokenKey)
  }

  public async isLoggedUser(): Promise<boolean> {
    const sessionId = await this.getSessionId()
    return !!sessionId
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

  public login(login: string, password: string) {
    return this.exchangeToken(login, password).then(({ data }: ServerResponse) => {
      if (data.result.token) {
        return this.config.storage.setItem(this.config.tokenKey, data.result.token)
      }
      throw new Error('Invalid login name or password')
    })
  }

  public logout() {
    return this.config.storage.removeItem(this.config.tokenKey)
  }

  public async checkLoggedUser() {
    const sessionId = await this.getSessionId()
    if (!sessionId) {
      throw new Error('Login required')
    }
  }

  public query(params: QueryOptions, options?: any): Promise<ServerResponse> {
    const query = this.buildQuery(params)
    return this.request.rpc(query.route, query.params, options)
  }

  private buildQuery(options: QueryOptions): QueryOutput {
    let route = ''
    const params = options.params || {}
    if (options.route) {
      route = options.route
    } else if (options.model && options.method) {
        route = '/web/dataset/call_kw/' + options.model + '/' + options.method
    }
    if (options.method) {
        params.args = options.args || []
        params.model = options.model
        params.method = options.method
        params.kwargs = Object.assign(params.kwargs, {}, options.kwargs)
        params.kwargs.context = options.context || params.context || params.kwargs.context
    }

    if (options.method === 'read_group') {
      if (!(params.args && params.args[0] !== undefined)) {
          params.kwargs.domain = options.domain || params.domain || params.kwargs.domain || []
      }
      if (!(params.args && params.args[1] !== undefined)) {
          params.kwargs.fields = options.fields || params.fields || params.kwargs.fields || []
      }
      if (!(params.args && params.args[2] !== undefined)) {
          params.kwargs.groupby = options.groupBy || params.groupBy || params.kwargs.groupby || []
      }
      params.kwargs.offset = options.offset || params.offset || params.kwargs.offset
      params.kwargs.limit = options.limit || params.limit || params.kwargs.limit
      // In kwargs, we look for "orderby" rather than "orderBy" (note the absence of capital B),
      // since the Python argument to the actual function is "orderby".
      const orderBy = options.orderBy || params.orderBy || params.kwargs.orderby
      params.kwargs.orderby = orderBy ? this.serializeSort(orderBy) : orderBy
      params.kwargs.lazy = 'lazy' in options ? options.lazy : params.lazy
    }

    if (options.method === 'search_read') {
      // call the model method
      params.kwargs.domain = options.domain || params.domain || params.kwargs.domain
      params.kwargs.fields = options.fields || params.fields || params.kwargs.fields
      params.kwargs.offset = options.offset || params.offset || params.kwargs.offset
      params.kwargs.limit = options.limit || params.limit || params.kwargs.limit
      // In kwargs, we look for "order" rather than "orderBy" since the Python
      // argument to the actual function is "order".
      const orderBy = options.orderBy || params.orderBy || params.kwargs.order
      params.kwargs.order = orderBy ? this.serializeSort(orderBy) : orderBy
    }

    if (options.route === '/web/dataset/search_read') {
        // specifically call the controller
        params.model = options.model || params.model
        params.domain = options.domain || params.domain
        params.fields = options.fields || params.fields
        params.limit = options.limit || params.limit
        params.offset = options.offset || params.offset
        const orderBy = options.orderBy || params.orderBy
        params.sort = orderBy ? this.serializeSort(orderBy) : orderBy
        params.context = options.context || params.context || {}
    }

    return {
      route,
      params: JSON.parse(JSON.stringify(params)),
    }
  }

  private serializeSort(orderBy: [any]): string {
    return orderBy.map((order) => `${order.name} ${order.asc !== false ? 'ASC' : 'DESC'}`).join(', ')
  }

  // public get() {
  //   return this.request.execute('web/dataset/call_kw', {
  //     jsonrpc: '2.0',
  //     method: 'read',
  //     params: {
  //       method: 'read',
  //       model: 'res.partner',
  //       args: [4],
  //       kwargs: {
  //         fields: ['id', 'name'],
  //       },
  //     },
  //     id: Math.floor(Math.random() * 1000 * 1000 * 1000),
  //   })
  // }
}
