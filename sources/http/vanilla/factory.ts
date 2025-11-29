import { execute } from './helpers'
import type {
  HttpVanillaBuilder,
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
import type { HttpOptions, Outcome } from '../core/models'
import { create } from '../core/request'
import type { Http } from '../core/request'

export const factory = <const Options extends Partial<HttpOptions>>(options?: Options) =>
  builder(create(options))

const builder = <Base extends string>(http: Http<Base>): HttpVanillaBuilder<Base> => ({
  get: getter(http),
  post: poster(http),
  put: putter(http),
  delete: deleter(http),
  patch: patcher(http),
  extend: <const Extended extends Partial<HttpOptions>>(extended: Extended) =>
    builder(http.extend(extended)),
})

const getter =
  <Base extends string>(http: Http<Base>) =>
  <Data>(
    source: HttpVanillaGetSource<Base, Data>,
    options?: HttpVanillaGetOptions<Data>,
  ): Promise<Outcome<Data>> =>
    execute(http, 'GET', source, undefined, options)

const poster =
  <Base extends string>(http: Http<Base>) =>
  <Data, Body = unknown>(
    source: HttpVanillaPostSource<Base, Data, Body>,
    body?: Body,
    options?: HttpVanillaPostOptions<Data>,
  ): Promise<Outcome<Data>> =>
    execute(http, 'POST', source, body, options)

const putter =
  <Base extends string>(http: Http<Base>) =>
  <Data, Body = unknown>(
    source: HttpVanillaPutSource<Base, Data, Body>,
    body?: Body,
    options?: HttpVanillaPutOptions<Data>,
  ): Promise<Outcome<Data>> =>
    execute(http, 'PUT', source, body, options)

const patcher =
  <Base extends string>(http: Http<Base>) =>
  <Data, Body = unknown>(
    source: HttpVanillaPatchSource<Base, Data, Body>,
    body?: Body,
    options?: HttpVanillaPatchOptions<Data>,
  ): Promise<Outcome<Data>> =>
    execute(http, 'PATCH', source, body, options)

const deleter =
  <Base extends string>(http: Http<Base>) =>
  <Data>(
    source: HttpVanillaDeleteSource<Base, Data>,
    options?: HttpVanillaDeleteOptions<Data>,
  ): Promise<Outcome<Data>> =>
    execute(http, 'DELETE', source, undefined, options)
