import { StatusCodes } from 'http-status-codes'
import { describe, test, expect, vi } from 'vitest'

import { execute } from './helpers'
import type { Http } from '../core/request'

describe('helpers.ts', () => {
  test('GETの場合、エンドポイントとオプションを渡すこと', async () => {
    const data = { id: 1, name: 'Got' }
    const options = { verify: (value: typeof data) => 'id' in value }
    const http = {
      get: vi.fn().mockResolvedValue({ success: true, status: StatusCodes.OK, data }),
    } as unknown as Http<string>

    await execute(http, 'GET', '/users', undefined, options)

    expect(http.get).toHaveBeenCalledWith('/users', options)
  })

  test('POSTの場合、エンドポイントとボディとオプションを渡すこと', async () => {
    const body = { name: 'Posted' }
    const data = { id: 1, ...body }
    const options = { verify: (value: typeof data) => 'id' in value }
    const http = {
      post: vi.fn().mockResolvedValue({
        success: true,
        status: StatusCodes.CREATED,
        data,
      }),
    } as unknown as Http<string>

    await execute(http, 'POST', '/users', body, options)

    expect(http.post).toHaveBeenCalledWith('/users', body, options)
  })

  test('PUTの場合、エンドポイントとボディとオプションを渡すこと', async () => {
    const body = { name: 'Put' }
    const data = { id: 1, ...body }
    const options = { verify: (value: typeof data) => 'id' in value }
    const http = {
      put: vi.fn().mockResolvedValue({ success: true, status: StatusCodes.OK, data }),
    } as unknown as Http<string>

    await execute(http, 'PUT', '/users/1', body, options)

    expect(http.put).toHaveBeenCalledWith('/users/1', body, options)
  })

  test('PATCHの場合、エンドポイントとボディとオプションを渡すこと', async () => {
    const body = { name: 'Patched' }
    const data = { id: 1, ...body }
    const options = { verify: (value: typeof data) => 'id' in value }
    const http = {
      patch: vi.fn().mockResolvedValue({ success: true, status: StatusCodes.OK, data }),
    } as unknown as Http<string>

    await execute(http, 'PATCH', '/users/1', body, options)

    expect(http.patch).toHaveBeenCalledWith('/users/1', body, options)
  })

  test('DELETEの場合、エンドポイントとオプションを渡すこと', async () => {
    const options = { verify: () => true }
    const http = {
      delete: vi.fn().mockResolvedValue({
        success: true,
        status: StatusCodes.NO_CONTENT,
        data: undefined,
      }),
    } as unknown as Http<string>

    await execute(http, 'DELETE', '/users/1', undefined, options)

    expect(http.delete).toHaveBeenCalledWith('/users/1', options)
  })
})
