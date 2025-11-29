'use client'

import type { InfiniteData } from '@tanstack/query-core'
import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'

import { to } from './helpers'
import type {
  HttpTanstackBuilder,
  HttpTanstackInfiniteQueryOutcome,
  HttpTanstackInfiniteQueryParameters,
  HttpTanstackInfiniteQuerySource,
  HttpTanstackInfiniteQueryVariables,
  HttpTanstackMutationOutcome,
  HttpTanstackMutationParameters,
  HttpTanstackMutationSource,
  HttpTanstackQueryOutcome,
  HttpTanstackQueryParameters,
  HttpTanstackQuerySource,
} from './models'
import { successify, unify } from '../core/helpers'
import type { HttpOptions, Failed, Method, Success, SuccessStatusCode } from '../core/models'
import { create } from '../core/request'
import type { Http } from '../core/request'
import { execute } from '../vanilla/helpers'

export const factory = <const Options extends Partial<HttpOptions>>(options?: Options) =>
  builder(create(options))

const builder = <Base extends string>(http: Http<Base>): HttpTanstackBuilder<Base> => ({
  get: getter(http),
  infinite: infiniter(http),
  post: poster(http),
  put: putter(http),
  patch: patcher(http),
  delete: deleter(http),
  extend: <const Extended extends Partial<HttpOptions>>(extended: Extended) =>
    builder(http.extend(extended)),
})

const getter =
  <Base extends string>(http: Http<Base>) =>
  <Data>(
    source: HttpTanstackQuerySource<Base, Data>,
    parameters: HttpTanstackQueryParameters<Data>,
  ): HttpTanstackQueryOutcome<Data> => {
    const { key, enabled, defaults, options, extras } = parameters

    const response = useQuery<Success<Data>, Failed>({
      queryKey: key,
      queryFn: async () => {
        const response = await unify<Data, []>({
          source,
          executor: (endpoint) => execute<Base, Data>(http, 'GET', endpoint, undefined, options),
          verify: options?.verify,
        })

        if (!response.success) {
          throw response
        }

        return response
      },
      enabled,
      initialData: defaults ? successify(defaults) : undefined,
      ...extras,
    })

    return to.query(response)
  }

const infiniter =
  <Base extends string>(http: Http<Base>) =>
  <Data, Source = Data, Variables = HttpTanstackInfiniteQueryVariables>(
    source: HttpTanstackInfiniteQuerySource<Base, Source, Variables>,
    parameters: HttpTanstackInfiniteQueryParameters<Data, Source, Variables> & {
      next: (parameters: {
        last: Success<Data>
        pages: Success<Data>[]
        variables: Variables
      }) => Variables | undefined
      transform?: (source: Source, variables: Variables) => Data
    },
  ): HttpTanstackInfiniteQueryOutcome<Data> => {
    const { key, enabled, defaults, variables: _variables, transform, next } = parameters
    const variables = (_variables ?? { page: 0 }) as Variables

    const response = useInfiniteQuery<
      Success<Data>,
      Failed,
      InfiniteData<Success<Data>, Variables>,
      unknown[],
      Variables
    >({
      queryKey: key,
      queryFn: async (context) => {
        const page = context.pageParam as Variables

        const response = await unify<Source, [Variables]>({
          source,
          parameters: [page],
          executor: (endpoint) =>
            execute<Base, Source>(http, 'GET', endpoint, undefined, undefined),
        })

        if (!response.success) {
          throw response
        }

        return transform
          ? successify(transform(response.data, page), response.status as SuccessStatusCode)
          : (response as unknown as Success<Data>)
      },
      getNextPageParam: (last, pages, variables) => next({ last, pages, variables }),
      initialPageParam: variables,
      initialData:
        defaults && transform
          ? {
              pages: [successify(transform(defaults, variables))],
              pageParams: [variables],
            }
          : defaults
            ? {
                pages: [successify(defaults as unknown as Data)],
                pageParams: [variables],
              }
            : undefined,
      enabled,
    })

    return to.infinite(response)
  }

const mutator = <Base extends string, Data, Variables>(
  http: Http<Base>,
  method: Exclude<Method, 'GET'>,
  source: HttpTanstackMutationSource<Base, Data, Variables>,
  parameters: HttpTanstackMutationParameters<Data, Variables>,
): HttpTanstackMutationOutcome<Data, Variables> => {
  const { key, success, failure, invalidates, options, extras } = parameters
  const cache = useQueryClient()

  const response = useMutation<Success<Data>, Failed, Variables>({
    mutationKey: key,
    mutationFn: async (variables: Variables) => {
      const response = await unify<Data, [Variables]>({
        source,
        parameters: [variables],
        executor: (endpoint) => execute<Base, Data>(http, method, endpoint, variables, options),
        verify: options?.verify,
      })

      if (!response.success) {
        throw response
      }

      return response
    },
    onSuccess: (data, variables) => {
      if (invalidates) {
        for (const filter of invalidates) {
          if (Array.isArray(filter)) {
            cache.invalidateQueries({ queryKey: filter })
          } else {
            cache.invalidateQueries({ queryKey: filter.key, type: filter.mode })
          }
        }
      }

      success?.(data, variables)
    },
    onError: (failed, variables) => failure?.(failed, variables),
    ...extras,
  })

  return to.mutation(response)
}

const poster =
  <Base extends string>(http: Http<Base>) =>
  <Data, Variables>(
    source: HttpTanstackMutationSource<Base, Data, Variables>,
    parameters: HttpTanstackMutationParameters<Data, Variables>,
  ) =>
    mutator(http, 'POST', source, parameters)

const putter =
  <Base extends string>(http: Http<Base>) =>
  <Data, Variables>(
    source: HttpTanstackMutationSource<Base, Data, Variables>,
    parameters: HttpTanstackMutationParameters<Data, Variables>,
  ) =>
    mutator(http, 'PUT', source, parameters)

const patcher =
  <Base extends string>(http: Http<Base>) =>
  <Data, Variables>(
    source: HttpTanstackMutationSource<Base, Data, Variables>,
    parameters: HttpTanstackMutationParameters<Data, Variables>,
  ) =>
    mutator(http, 'PATCH', source, parameters)

const deleter =
  <Base extends string>(http: Http<Base>) =>
  <Data, Variables>(
    source: HttpTanstackMutationSource<Base, Data, Variables>,
    parameters: HttpTanstackMutationParameters<Data, Variables>,
  ) =>
    mutator(http, 'DELETE', source, parameters)
