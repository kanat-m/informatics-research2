import type {
  Assessment,
  AssessmentInput,
  LoginRequest,
  Token,
  User,
  UserCreate,
} from "./types";

const API_URL = process.env.API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${await res.text()}`);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

function authHeaders(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  list(q?: string, page = 1, pageSize = 20) {
    const params = new URLSearchParams({
      limit: String(pageSize),
      offset: String((page - 1) * pageSize),
    });
    if (q) params.set("q", q);
    return request<Assessment[]>(`/assessments?${params}`);
  },

  semanticSearch(q: string, limit = 10) {
    const params = new URLSearchParams({ q, limit: String(limit) });
    return request<Assessment[]>(`/assessments/semantic?${params}`);
  },

  async get(id: number): Promise<Assessment | null> {
    const res = await fetch(`${API_URL}/assessments/${id}`, {
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`API ${res.status}`);
    return res.json();
  },

  create(data: AssessmentInput, token: string | null) {
    return request<Assessment>("/assessments", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
  },

  update(id: number, data: Partial<AssessmentInput>, token: string | null) {
    return request<Assessment>(`/assessments/${id}`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
  },

  remove(id: number, token: string | null) {
    return request<void>(`/assessments/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
  },

  register(data: UserCreate) {
    return request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  login(data: LoginRequest) {
    return request<Token>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  me(token: string) {
    return request<User>("/auth/me", {
      headers: authHeaders(token),
    });
  },
};