import type {
  QueryStatus,
  QueryObserverOptions,
  InvalidateQueryFilters,
  MutationObserverOptions,
  MutationStatus,
  MutationObserverResult,
  Override,
  InfiniteQueryObserverResult,
  InfiniteData,
  QueryObserverResult,
} from '@tanstack/query-core'

import type {
  Endpoint,
  ExtendedBase,
  Failed,
  HttpOptions,
  Outcome,
  RequestOptions,
  Success,
} from '../core/models'

export type HttpTanstackQuerySource<Base extends string, Data = unknown> =
  | Endpoint<Base>
  | (() => Promise<Outcome<Data>>)

export type HttpTanstackQueryParameters<Data = unknown> = {
  key: unknown[]
  enabled?: boolean
  defaults?: Data
  options?: RequestOptions<Data>
  extras?: Omit<
    QueryObserverOptions<Success<Data>, Failed>,
    'queryKey' | 'queryFn' | 'enabled' | 'initialData'
  >
}

export type BaseTanstackQueryOutcome<Data> = Override<
  QueryObserverResult<Success<Data>, Failed>,
  /* biome-ignore lint/complexity/noBannedTypes: 統一的な型定義のため */
  {}
>

export type HttpTanstackQueryOutcome<Data> = {
  states: {
    status: QueryStatus
    success: boolean
    failed: boolean
    pending: boolean
    loading: boolean
    fetching: boolean
    refetching: boolean
    stale: boolean
  }
  responses: {
    success: Success<Data> | undefined
    failed: Failed | null
  }
  handlers: {
    refetch: () => void
  }
}

export type HttpTanstackQuery<Base extends string, Data> = (
  source: HttpTanstackQuerySource<Base, Data>,
  parameters: HttpTanstackQueryParameters<Data>,
) => HttpTanstackQueryOutcome<Data>

export type HttpTanstackInfiniteQueryVariables = {
  page: number
}

export type HttpTanstackInfiniteQuerySource<
  Base extends string,
  Data = unknown,
  Variables = HttpTanstackInfiniteQueryVariables,
> = Endpoint<Base> | ((variables: Variables) => Endpoint<Base> | Promise<Outcome<Data>>)

export type HttpTanstackInfiniteQueryParameters<
  Data = unknown,
  Source = Data,
  Variables = HttpTanstackInfiniteQueryVariables,
> = {
  key: unknown[]
  enabled?: boolean
  defaults?: Source
} & (Variables extends HttpTanstackInfiniteQueryVariables
  ? { variables?: Variables }
  : { variables: Variables })

export type BaseTanstackInfiniteQueryOutcome<Data> = Override<
  InfiniteQueryObserverResult<InfiniteData<Success<Data>>, Failed>,
  /* biome-ignore lint/complexity/noBannedTypes: 統一的な型定義のため */
  {}
>

export type HttpTanstackInfiniteQueryOutcome<Data> = {
  states: {
    status: QueryStatus
    success: boolean
    failed: boolean
    pending: boolean
    loading: boolean
    fetching: boolean
    paging: boolean
    more: boolean
    refetching: boolean
    stale: boolean
  }
  responses: {
    success: Success<Data>[]
    failed: Failed | null
  }
  handlers: {
    next: () => void
    refetch: () => void
  }
}

export type HttpTanstackInfiniteQuery<Base extends string, Data> = (
  source: HttpTanstackInfiniteQuerySource<Base, Data>,
  parameters: HttpTanstackInfiniteQueryParameters<Data>,
) => HttpTanstackInfiniteQueryOutcome<Data>

export type HttpTanstackMutationSource<Base extends string, Data = unknown, Variables = unknown> =
  | Endpoint<Base>
  | ((variables: Variables) => Endpoint<Base> | Promise<Outcome<Data>>)

export type HttpTanstackMutationInvalidate = {
  key: unknown[]
  mode?: InvalidateQueryFilters['type']
}

export type HttpTanstackMutationParameters<Data, Variables = void> = {
  key?: unknown[]
  success?: (success: Success<Data>, variables: Variables) => void
  failure?: (failed: Failed, variables: Variables) => void
  invalidates?: (HttpTanstackMutationInvalidate | unknown[])[]
  options?: RequestOptions<Data>
  extras?: Omit<
    MutationObserverOptions<Success<Data>, Failed, Variables>,
    'mutationKey' | 'mutationFn' | 'onSuccess' | 'onError'
  >
}

export type BaseTanstackMutationOutcome<Data, Variables> = Override<
  MutationObserverResult<Success<Data>, Failed, Variables>,
  { mutate: (variables: Variables) => void }
> & {
  mutateAsync: (variables: Variables) => Promise<Outcome<Data>>
}

export type HttpTanstackMutationOutcome<Data, Variables> = {
  states: {
    status: MutationStatus
    success: boolean
    failed: boolean
    pending: boolean
    idle: boolean
  }
  responses: {
    success: Success<Data> | undefined
    failed: Failed | null
  }
  handlers: {
    fire: (variables: Variables) => void
    execute: (variables: Variables) => Promise<Outcome<Data>>
    reset: () => void
  }
}

export type HttpTanstackMutation<Base extends string, Data, Variables = unknown> = (
  source: HttpTanstackMutationSource<Base, Data, Variables>,
  parameters: HttpTanstackMutationParameters<Data, Variables>,
) => HttpTanstackMutationOutcome<Data, Variables>

export type HttpTanstackMethods<Base extends string> = {
  get: {
    <Data>(
      action: () => Promise<Outcome<Data>>,
      parameters: HttpTanstackQueryParameters<Data>,
    ): HttpTanstackQueryOutcome<Data>
    <Data>(
      endpoint: Endpoint<Base>,
      parameters: HttpTanstackQueryParameters<Data>,
    ): HttpTanstackQueryOutcome<Data>
  }
  infinite: {
    <Data, Variables = HttpTanstackInfiniteQueryVariables>(
      action: (variables: Variables) => Promise<Outcome<Data>>,
      parameters: HttpTanstackInfiniteQueryParameters<Data, Data, Variables> & {
        next: (parameters: {
          last: Success<Data>
          pages: Success<Data>[]
          variables: Variables
        }) => Variables | undefined
      },
    ): HttpTanstackInfiniteQueryOutcome<Data>
    <Data, Source, Variables = HttpTanstackInfiniteQueryVariables>(
      action: (variables: Variables) => Promise<Outcome<Source>>,
      parameters: HttpTanstackInfiniteQueryParameters<Data, Source, Variables> & {
        next: (parameters: {
          last: Success<Data>
          pages: Success<Data>[]
          variables: Variables
        }) => Variables | undefined
        transform: (source: Source, variables: Variables) => Data
      },
    ): HttpTanstackInfiniteQueryOutcome<Data>
    <Data, Variables = HttpTanstackInfiniteQueryVariables>(
      endpoint: Endpoint<Base>,
      parameters: HttpTanstackInfiniteQueryParameters<Data, Data, Variables> & {
        next: (parameters: {
          last: Success<Data>
          pages: Success<Data>[]
          variables: Variables
        }) => Variables | undefined
      },
    ): HttpTanstackInfiniteQueryOutcome<Data>
    <Data, Variables = HttpTanstackInfiniteQueryVariables>(
      template: (variables: Variables) => Endpoint<Base>,
      parameters: HttpTanstackInfiniteQueryParameters<Data, Data, Variables> & {
        next: (parameters: {
          last: Success<Data>
          pages: Success<Data>[]
          variables: Variables
        }) => Variables | undefined
      },
    ): HttpTanstackInfiniteQueryOutcome<Data>
    <Data, Source, Variables = HttpTanstackInfiniteQueryVariables>(
      template: (variables: Variables) => Endpoint<Base>,
      parameters: HttpTanstackInfiniteQueryParameters<Data, Source, Variables> & {
        next: (parameters: {
          last: Success<Data>
          pages: Success<Data>[]
          variables: Variables
        }) => Variables | undefined
        transform: (source: Source, variables: Variables) => Data
      },
    ): HttpTanstackInfiniteQueryOutcome<Data>
  }
  post: {
    <Data, Variables = void>(
      action: (variables: Variables) => Promise<Outcome<Data>>,
      parameters: HttpTanstackMutationParameters<Data, Variables>,
    ): HttpTanstackMutationOutcome<Data, Variables>
    <Data, Variables = unknown>(
      endpoint: Endpoint<Base>,
      parameters: HttpTanstackMutationParameters<Data, Variables>,
    ): HttpTanstackMutationOutcome<Data, Variables>
    <Data, Variables = unknown>(
      template: (variables: Variables) => Endpoint<Base>,
      parameters: HttpTanstackMutationParameters<Data, Variables>,
    ): HttpTanstackMutationOutcome<Data, Variables>
  }
  put: {
    <Data, Variables = void>(
      action: (variables: Variables) => Promise<Outcome<Data>>,
      parameters: HttpTanstackMutationParameters<Data, Variables>,
    ): HttpTanstackMutationOutcome<Data, Variables>
    <Data, Variables = unknown>(
      endpoint: Endpoint<Base>,
      parameters: HttpTanstackMutationParameters<Data, Variables>,
    ): HttpTanstackMutationOutcome<Data, Variables>
    <Data, Variables = unknown>(
      template: (variables: Variables) => Endpoint<Base>,
      parameters: HttpTanstackMutationParameters<Data, Variables>,
    ): HttpTanstackMutationOutcome<Data, Variables>
  }
  patch: {
    <Data, Variables = void>(
      action: (variables: Variables) => Promise<Outcome<Data>>,
      parameters: HttpTanstackMutationParameters<Data, Variables>,
    ): HttpTanstackMutationOutcome<Data, Variables>
    <Data, Variables = unknown>(
      endpoint: Endpoint<Base>,
      parameters: HttpTanstackMutationParameters<Data, Variables>,
    ): HttpTanstackMutationOutcome<Data, Variables>
    <Data, Variables = unknown>(
      template: (variables: Variables) => Endpoint<Base>,
      parameters: HttpTanstackMutationParameters<Data, Variables>,
    ): HttpTanstackMutationOutcome<Data, Variables>
  }
  delete: {
    <Data, Variables = void>(
      action: (variables: Variables) => Promise<Outcome<Data>>,
      parameters: HttpTanstackMutationParameters<Data, Variables>,
    ): HttpTanstackMutationOutcome<Data, Variables>
    <Data, Variables = unknown>(
      endpoint: Endpoint<Base>,
      parameters: HttpTanstackMutationParameters<Data, Variables>,
    ): HttpTanstackMutationOutcome<Data, Variables>
    <Data, Variables = unknown>(
      template: (variables: Variables) => Endpoint<Base>,
      parameters: HttpTanstackMutationParameters<Data, Variables>,
    ): HttpTanstackMutationOutcome<Data, Variables>
  }
}

export type HttpTanstackBuilder<Base extends string> = HttpTanstackMethods<Base> & {
  extend: <const Extended extends Partial<HttpOptions>>(
    extended: Extended,
  ) => HttpTanstackBuilder<ExtendedBase<Base, Extended>>
}
