export interface AnyFunc {
  (...args: any[]): any
  [key: keyof any]: any
}
export declare type ValueOf<T> = T[keyof T]
export type Meta = Record<keyof any, any>
export interface Info {
  type: string
  flag: string
  meta?: Meta | Meta[]
  count?: number
  error?: any
  message?: string
  filename?: string
  lineno?: number
  colno?: number
  time?: number
}
export declare class InfoList extends Array<Info> {
  __waiting__?: boolean
}
export declare type CustomInfo = Pick<Info, Exclude<keyof Info, 'type' | 'flag'>>
export interface Config {
  sameLimit?: number
  retry?: boolean
  retryTime?: number
  failMaxNum?: number
  listeners?: boolean | {
    jsError: boolean
    staticError: boolean
    promiseRection: boolean
  }
  errorHandler: ErrorHandler
  plugins?: Plugin[]
  sync?: boolean
}
export interface NormalizeConfig {
  sameLimit: number
  retry: boolean
  retryTime: number
  failMaxNum: number
  listeners: boolean | {
    jsError: boolean
    staticError: boolean
    promiseRection: boolean
  }
  errorHandler: ErrorHandler
  plugins: Plugin[]
  sync: boolean
}
export interface ErrorHandler {
  (info: InfoList, notify: (result: any) => void): any
}
export interface Plugin {
  apply(register: Register): void
}
export declare enum HookNames {
  ADDHOOK = 'addInfo',
  SUCCESSHOOK = 'success',
  FAILHOOK = 'fail',
  SCHEDULABLEHOOK = 'schedulable',
  JSERRORHOOK = 'jsError',
  STATICERRORHOOK = 'staticError',
  PROMISERECTIONHOOK = 'promiseRejection',
}
export interface Hook {
  (...args: any): any
}
export declare class HookArray extends Array<Hook> {
  pluginNameList?: string[]
}
export declare type HooksMap = Record<HookNames, HookArray>
export declare type Register = Record<HookNames, (pluginName: string, hook: Hook) => void>
export interface CreateCustomInsert {
  (type: string, flag: string, extra?: any): (info: CustomInfo) => void
}
export interface CaughtScheduler {
  pendingInsertInfo(info: Info): void
  createCustomInsert: CreateCustomInsert
  retryHandler(): void
  stop: boolean
}
export declare type proxyConfig = {
  flag: any
  withArgs?: boolean
  others?: any
} | string
export interface ProxyCaught {
  <T extends AnyFunc>(rawFunc: T, config: proxyConfig): (this: any, ...args: Parameters<T>) => any
}
export interface Caught {
  config: NormalizeConfig
  hooksMap: HooksMap
  scheduler: CaughtScheduler
  createCustomInsert: CreateCustomInsert
  proxyCaught: ProxyCaught
}
