import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { apiFetch, ApiError } from "@/utils/api";

declare global {
  // eslint-disable-next-line no-var
  var fetch: typeof globalThis.fetch;
}

const originalFetch = global.fetch;

beforeEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

afterEach(() => {
  global.fetch = originalFetch;
  vi.resetModules();
  vi.useRealTimers();
});

describe("apiFetch", () => {
  it("resolves JSON payload when response is ok", async () => {
    const payload = { data: 42 };
    const json = vi.fn().mockResolvedValue(payload);
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json }) as unknown as typeof fetch;

    const result = await apiFetch<typeof payload>("/api/test");

    expect(global.fetch).toHaveBeenCalledWith("/api/test", undefined);
    expect(json).toHaveBeenCalled();
    expect(result).toEqual(payload);
  });

  it("throws ApiError with detail message when response fails", async () => {
    const json = vi.fn().mockResolvedValue({ detail: "Invalid request" });
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 422, json }) as unknown as typeof fetch;

    await expect(apiFetch("/api/error")).rejects.toMatchObject({ message: "Invalid request", status: 422 });
  });

  it("throws ApiError with fallback message when response fails without detail", async () => {
    const json = vi.fn().mockResolvedValue({});
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, json }) as unknown as typeof fetch;

    await expect(apiFetch("/api/boom")).rejects.toBeInstanceOf(ApiError);
  });

  it("returns undefined when parseJson is false", async () => {
    const json = vi.fn();
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json }) as unknown as typeof fetch;

    const result = await apiFetch("/api/raw", { parseJson: false });

    expect(result).toBeUndefined();
    expect(json).not.toHaveBeenCalled();
  });

  it("rejects with timeout error when fetch request hangs", async () => {
    vi.useFakeTimers();
    global.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch;

    const capturedError = apiFetch("/api/slow").catch((error) => error);

    await vi.advanceTimersByTimeAsync(16000);

    const error = await capturedError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ message: expect.stringMatching(/timed out/i), status: 408 });
  });
});