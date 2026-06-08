import { http, HttpResponse } from "msw";
import type { User } from "@supabase/supabase-js";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const mockUser: Pick<User, "id" | "email"> = {
  id: "user-123",
  email: "test@example.com",
};

export const handlers = [
  http.get(`${BASE_URL}/api/v1/todos`, () => {
    return HttpResponse.json({
      data: [],
      page: 1,
      limit: 20,
      total: 0,
    });
  }),

  http.get(`${BASE_URL}/api/v1/auth/me`, () => {
    return HttpResponse.json({ user: mockUser });
  }),

  http.post(`${BASE_URL}/api/v1/auth/signout`, () => {
    return HttpResponse.json({ success: true });
  }),
];
