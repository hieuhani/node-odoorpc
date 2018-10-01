import { AxiosResponse } from 'axios'
import { OdooRPC } from './odoorpc'

export interface Storage {
  getItem: (key: string) => Promise<any>,
  setItem: (key: string, value: string) => Promise<any>,
  removeItem: (key: string) => Promise<any>,
}

export interface OdooRPCOptions {
  domain?: string,
  port?: number,
  database?: string,
  https?: boolean,
  useSaaS?: boolean,
}

export interface OdooRPCConfig {
  storage?: Storage,
  dataKey?: string,
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

export interface AuthResponse {
  session_id: string,
  sign_in_token: string,
  db_name: string,
  user_id: string,
}

export {
  AxiosResponse as ServerResponse,
  OdooRPC,
}
