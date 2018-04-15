import { AxiosResponse } from 'axios'

export interface OdooRPCOptions {
  domain?: string,
  port?: number,
  database?: string,
}

export interface OdooRPCConfig {
  tokenKey: string,
}

export enum Environment {
  Browser,
  Node,
}

export interface QueryOptions {
  args?: any[],
  context?: any,
  domain?: any,
  fields?: string[],
  groupBy?: string[],
  kwargs?: any,
  limit?: number | false,
  method: string,
  model: string,
  offset?: number,
  orderBy?: [string],
  params?: any,
  route?: string,
  lazy?: any,
}

export interface QueryOutput {
  route: string,
  params: any,
}

export {
  AxiosResponse as ServerResponse,
}
