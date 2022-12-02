import * as trpc from "https://esm.sh/@trpc/server@10.4.2";

import { CreateContextFnOptions } from "./drashAdapter/types.ts";

export function createContext({ req }: CreateContextFnOptions) {
  const user = { name: req.headers.get("username") ?? "anonymous" };
  return { req, user };
}
export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const t = trpc.initTRPC.context<Context>().create();

export const appRouter = t.router({
  // deno-lint-ignore no-unused-vars
  hello: t.procedure.query(({ input }) => {
    return { hello: "fokin trpc on drash!" };
  }),
});

export type AppRouter = typeof appRouter; // tRPC type-only export
