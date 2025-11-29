import type { Endpoint, ExtendedBase, HttpOptions, Outcome, RequestOptions } from '../core/models'

export type HttpVanillaGetSource<Base extends string, Data = unknown> =
  | Endpoint<Base>
  | (() => Promise<Outcome<Data>>)

export type HttpVanillaGetOptions<Data> = RequestOptions<Data>

export type HttpVanillaGet<Base extends string, Data> = (
  source: HttpVanillaGetSource<Base, Data>,
  options?: HttpVanillaGetOptions<Data>,
) => Promise<Outcome<Data>>

export type HttpVanillaPostSource<Base extends string, Data = unknown, Body = unknown> =
  | Endpoint<Base>
  | ((body?: Body) => Promise<Outcome<Data>>)

export type HttpVanillaPostOptions<Data> = RequestOptions<Data>

export type HttpVanillaPost<Base extends string, Data, Body = unknown> = (
  source: HttpVanillaPostSource<Base, Data, Body>,
  body?: Body,
  options?: HttpVanillaPostOptions<Data>,
) => Promise<Outcome<Data>>

export type HttpVanillaPutSource<Base extends string, Data = unknown, Body = unknown> =
  | Endpoint<Base>
  | ((body?: Body) => Promise<Outcome<Data>>)

export type HttpVanillaPutOptions<Data> = RequestOptions<Data>

export type HttpVanillaPut<Base extends string, Data, Body = unknown> = (
  source: HttpVanillaPutSource<Base, Data, Body>,
  body?: Body,
  options?: HttpVanillaPutOptions<Data>,
) => Promise<Outcome<Data>>

export type HttpVanillaPatchSource<Base extends string, Data = unknown, Body = unknown> =
  | Endpoint<Base>
  | ((body?: Body) => Promise<Outcome<Data>>)

export type HttpVanillaPatchOptions<Data> = RequestOptions<Data>

export type HttpVanillaPatch<Base extends string, Data, Body = unknown> = (
  source: HttpVanillaPatchSource<Base, Data, Body>,
  body?: Body,
  options?: HttpVanillaPatchOptions<Data>,
) => Promise<Outcome<Data>>

export type HttpVanillaDeleteSource<Base extends string, Data = unknown> =
  | Endpoint<Base>
  | (() => Promise<Outcome<Data>>)

export type HttpVanillaDeleteOptions<Data> = RequestOptions<Data>

export type HttpVanillaDelete<Base extends string, Data> = (
  source: HttpVanillaDeleteSource<Base, Data>,
  options?: HttpVanillaDeleteOptions<Data>,
) => Promise<Outcome<Data>>

export type HttpVanillaMethods<Base extends string> = {
  get: {
    <Data>(
      action: () => Promise<Outcome<Data>>,
      options?: HttpVanillaGetOptions<Data>,
    ): Promise<Outcome<Data>>
    <Data>(endpoint: Endpoint<Base>, options?: HttpVanillaGetOptions<Data>): Promise<Outcome<Data>>
  }
  post: {
    <Data, Body = unknown>(
      action: (body?: Body) => Promise<Outcome<Data>>,
      body?: Body,
      options?: HttpVanillaPostOptions<Data>,
    ): Promise<Outcome<Data>>
    <Data, Body = unknown>(
      endpoint: Endpoint<Base>,
      body?: Body,
      options?: HttpVanillaPostOptions<Data>,
    ): Promise<Outcome<Data>>
  }
  put: {
    <Data, Body = unknown>(
      action: (body?: Body) => Promise<Outcome<Data>>,
      body?: Body,
      options?: HttpVanillaPutOptions<Data>,
    ): Promise<Outcome<Data>>
    <Data, Body = unknown>(
      endpoint: Endpoint<Base>,
      body?: Body,
      options?: HttpVanillaPutOptions<Data>,
    ): Promise<Outcome<Data>>
  }
  patch: {
    <Data, Body = unknown>(
      action: (body?: Body) => Promise<Outcome<Data>>,
      body?: Body,
      options?: HttpVanillaPatchOptions<Data>,
    ): Promise<Outcome<Data>>
    <Data, Body = unknown>(
      endpoint: Endpoint<Base>,
      body?: Body,
      options?: HttpVanillaPatchOptions<Data>,
    ): Promise<Outcome<Data>>
  }
  delete: {
    <Data>(
      action: () => Promise<Outcome<Data>>,
      options?: HttpVanillaDeleteOptions<Data>,
    ): Promise<Outcome<Data>>
    <Data>(
      endpoint: Endpoint<Base>,
      options?: HttpVanillaDeleteOptions<Data>,
    ): Promise<Outcome<Data>>
  }
}

export type HttpVanillaBuilder<Base extends string> = HttpVanillaMethods<Base> & {
  extend: <const Extended extends Partial<HttpOptions>>(
    extended: Extended,
  ) => HttpVanillaBuilder<ExtendedBase<Base, Extended>>
}
