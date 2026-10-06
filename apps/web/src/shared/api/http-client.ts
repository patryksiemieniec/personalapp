import { env } from '../config/env';

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  code: string;
  requestId: string;

  errors?: Array<{
    field: string;
    messages: string[];
  }>;
}

const API_URL = env.NEXT_PUBLIC_API_URL;

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly problem: ProblemDetails | null,
  ) {
    super(problem?.detail ?? `HTTP request failed with status ${status}`);

    this.name = HttpError.name;
  }
}

export async function httpClient<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);

  if (init?.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => null);

    throw new HttpError(response.status, problem);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
