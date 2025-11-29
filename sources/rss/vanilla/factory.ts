import { getReasonPhrase, StatusCodes } from 'http-status-codes'

import type { RssVanillaBuilder, RssVanillaGetSource } from './models'
import { unify } from '../../http/core/helpers'
import type { DefaultBase, ExtendedBase, HttpOptions, Outcome } from '../../http/core/models'
import { factory as http } from '../../http/vanilla'
import type { HttpVanillaBuilder } from '../../http/vanilla/models'
import type { Feed } from '../core/models'
import { FeedParser } from '../core/parser'

export const factory = <const Options extends Partial<HttpOptions>>(
  options?: Options,
): RssVanillaBuilder<ExtendedBase<DefaultBase, Options>> =>
  builder(
    http({
      ...options,
      headers: {
        Accept: 'application/rss+xml, application/xml, text/xml',
        'User-Agent': 'Mozilla/5.0 (compatible; RSSReader/1.0)',
        ...options?.headers,
      },
    }) as HttpVanillaBuilder<ExtendedBase<DefaultBase, Options>>,
  )

const builder = <Base extends string>(http: HttpVanillaBuilder<Base>): RssVanillaBuilder<Base> => {
  const parser = new FeedParser()

  const get = async (source: RssVanillaGetSource<Base>): Promise<Outcome<Feed>> => {
    const response = await unify<string, []>({
      source,
      executor: (endpoint) => http.get(endpoint),
    })

    if (!response.success) {
      return response
    }

    try {
      const feed = await parser.parse(response.data)

      return {
        success: true,
        status: response.status,
        data: feed,
      }
    } catch (thrown) {
      return {
        success: false,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message:
          thrown instanceof Error
            ? thrown.message
            : getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
      }
    }
  }

  return {
    get,
    extend: <const Extended extends Partial<HttpOptions>>(extended: Extended) =>
      builder(http.extend(extended)),
  }
}
