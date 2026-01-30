export class ApiError extends Error {
  constructor(message: string, public readonly status?: number, public readonly cause?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export type FetchOptions = RequestInit & {
  parseJson?: boolean;
};

const DEFAULT_TIMEOUT = 15000;

const withTimeout = <T>(promise: Promise<T>, timeoutMs = DEFAULT_TIMEOUT) =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new ApiError("Request timed out", 408)), timeoutMs);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });

export const apiFetch = async <T = unknown>(input: string, init?: FetchOptions): Promise<T> => {
  try {
    const response = await withTimeout(fetch(input, init), DEFAULT_TIMEOUT);
    if (!response.ok) {
      const errorBody = await response
        .json()
        .catch(() => null);
      const detail = typeof errorBody === "object" && errorBody && "detail" in errorBody ? String(errorBody.detail) : undefined;
      throw new ApiError(detail ?? `Request failed with status ${response.status}`, response.status, errorBody);
    }
    if (init?.parseJson === false) {
      return undefined as unknown as T;
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : "Unexpected error", undefined, error);
  }
};