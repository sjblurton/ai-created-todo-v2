import { http, HttpResponse } from 'msw'

// MSW v2 in Node (Vitest) requires absolute URLs — relative paths are not resolved.
// Use http://localhost to match app fetches in the jsdom environment.
const BASE_URL = 'http://localhost'

export const handlers = [
  http.get(`${BASE_URL}/api/v1/todos`, () => {
    return HttpResponse.json({
      data: [],
      page: 1,
      limit: 20,
      total: 0,
    })
  }),
]
