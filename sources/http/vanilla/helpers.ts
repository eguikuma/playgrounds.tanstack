import type {
  HttpVanillaDeleteOptions,
  HttpVanillaDeleteSource,
  HttpVanillaGetOptions,
  HttpVanillaGetSource,
  HttpVanillaPatchOptions,
  HttpVanillaPatchSource,
  HttpVanillaPostOptions,
  HttpVanillaPostSource,
  HttpVanillaPutOptions,
  HttpVanillaPutSource,
} from './models'
import { unify } from '../core/helpers'
import type { Endpoint, Method, Outcome } from '../core/models'
import type { Http } from '../core/request'

export const execute = async <Base extends string, Data, Body = unknown>(
  http: Http<Base>,
  method: Method,
  source:
    | HttpVanillaGetSource<Base, Data>
    | HttpVanillaPostSource<Base, Data, Body>
    | HttpVanillaPutSource<Base, Data, Body>
    | HttpVanillaDeleteSource<Base, Data>
    | HttpVanillaPatchSource<Base, Data, Body>,
  body?: Body,
  options?:
    | HttpVanillaGetOptions<Data>
    | HttpVanillaPostOptions<Data>
    | HttpVanillaPutOptions<Data>
    | HttpVanillaDeleteOptions<Data>
    | HttpVanillaPatchOptions<Data>,
): Promise<Outcome<Data>> => {
  const handlers: Record<Method, (endpoint: Endpoint<Base>) => Promise<Outcome<Data>>> = {
    GET: (endpoint) => http.get<Data>(endpoint, options),
    POST: (endpoint) => http.post<Data>(endpoint, body, options),
    PUT: (endpoint) => http.put<Data>(endpoint, body, options),
    PATCH: (endpoint) => http.patch<Data>(endpoint, body, options),
    DELETE: (endpoint) => http.delete<Data>(endpoint, options),
  }

  return unify<Data, [Body?]>({
    source,
    parameters: [body],
    executor: handlers[method],
    verify: options?.verify,
  })
}
