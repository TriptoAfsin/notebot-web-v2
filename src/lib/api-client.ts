import axios, { AxiosError, type AxiosRequestConfig } from "axios";

/* One axios instance for the whole app.
 *
 * Every hook used to build its own request and wrap it in an identical
 * try/catch that re-threw `new Error("An unexpected error occurred")` — which
 * threw away the status code, so retry logic couldn't tell a 404 from a network
 * blip. This centralises the timeout and normalises errors once.
 */
export const http = axios.create({
  timeout: 15_000,
  headers: { Accept: "application/json, text/plain, */*" },
});

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ApiError";
    this.status = status;
  }
}

function toApiError(error: unknown, context: string): ApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return new ApiError(
        "The request timed out. Check your connection and try again.",
        undefined,
        { cause: error }
      );
    }

    if (status === 404) {
      return new ApiError("We couldn't find that content.", 404, {
        cause: error,
      });
    }

    if (status && status >= 500) {
      return new ApiError(
        "The server had trouble responding. Try again in a moment.",
        status,
        { cause: error }
      );
    }

    return new ApiError(
      error.message || `Request failed while ${context}.`,
      status,
      { cause: error }
    );
  }

  return new ApiError(`Something went wrong while ${context}.`, undefined, {
    cause: error,
  });
}

/** GET and return the payload, or throw a normalised `ApiError`. */
export async function getJson<T>(
  url: string,
  context: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await http.get<T>(url, config);
    return response.data;
  } catch (error) {
    throw toApiError(error, context);
  }
}

/** POST and return the payload, or throw a normalised `ApiError`. */
export async function postJson<T>(
  url: string,
  body: unknown,
  context: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await http.post<T>(url, body, config);
    return response.data;
  } catch (error) {
    throw toApiError(error, context);
  }
}

/** Client errors won't fix themselves — only retry transport and 5xx faults. */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) return false;
  const status = error instanceof ApiError ? error.status : undefined;
  if (status && status >= 400 && status < 500) return false;
  return true;
}
