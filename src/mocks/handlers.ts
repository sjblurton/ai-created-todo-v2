import { http, HttpResponse } from "msw";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const handlers = [
  http.get(`${BASE_URL}/api/v1/todos`, () => {
    return HttpResponse.json({
      data: [],
      page: 1,
      limit: 20,
      total: 0,
    });
  }),
];
