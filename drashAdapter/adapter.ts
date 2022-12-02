import { resolveHTTPResponse } from "https://esm.sh/@trpc/server@10.4.2/http";
import { AnyRouter } from "https://esm.sh/@trpc/server@10.4.2";
import { DrashRequestHandlerOptions } from "./types.ts";

export async function drashHandler<TRouter extends AnyRouter>(
  opts: DrashRequestHandlerOptions<TRouter>,
): Promise<Response> {
  const createContext = async () => {
    return await opts.createContext?.({ req: opts.req });
  };

  const url = new URL(opts.req.url);
  const path = url.pathname.slice(opts.endpoint.length + 1);
  const req = {
    query: url.searchParams,
    method: opts.req.method,
    headers: Object.fromEntries(opts.req.headers),
    body: await opts.req.text(),
  };

  const result = await resolveHTTPResponse({
    req,
    createContext,
    path,
    router: opts.router,
    batching: opts.batching,
    responseMeta: opts.responseMeta,
    onError(o) {
      opts?.onError?.({ ...o, req: opts.req });
    },
  });

  const res = new Response(result.body, {
    status: result.status,
  });

  for (const [key, value] of Object.entries(result.headers ?? {})) {
    if (typeof value === "undefined") {
      continue;
    }

    if (typeof value === "string") {
      res.headers.set(key, value);
      continue;
    }

    for (const v of value) {
      res.headers.append(key, v);
    }
  }
  return res;
}
