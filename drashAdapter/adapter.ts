import { resolveHTTPResponse } from "https://esm.sh/@trpc/server@10.4.2/http";
import { AnyRouter } from "https://esm.sh/@trpc/server@10.4.2";
import { DrashRequestHandlerOptions } from "./types.ts";
import { HTTPResponse } from "https://esm.sh/v99/@trpc/server@10.4.2/dist/http/internals/types.d.ts";

export async function drashHandler<TRouter extends AnyRouter>(
  opts: DrashRequestHandlerOptions<TRouter>,
): Promise<HTTPResponse> {
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

  for (const [key, value] of Object.entries(result.headers ?? {})) {
    if (typeof value === "undefined") {
      continue;
    }

    if (typeof value === "string") {
      opts.res.headers.set(key, value);
      continue;
    }

    for (const v of value) {
      opts.res.headers.append(key, v);
    }
  }
  
  opts.res.text('', result.status);
  opts.res.send('application/json', result.body ?? '');
  return result;
}
