import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';
import { initTRPC, inferAsyncReturnType } from 'npm:@trpc/server';
import { z } from 'npm:zod';
import { FetchCreateContextFnOptions } from 'npm:@trpc/server/adapters/fetch';
import { fetchRequestHandler } from 'npm:@trpc/server/adapters/fetch';

export function createContext({ req }: FetchCreateContextFnOptions) {
  const user = { name: req.headers.get('username') ?? 'anonymous' };
  return { req, user };
}
export type Context = inferAsyncReturnType<typeof createContext>;

type User = {
  id: string;
  name: string;
  bio?: string;
};
const users: Record<string, User> = {};
export const t = initTRPC.context<Context>().create();
export const appRouter = t.router({
  getUserById: t.procedure.input(z.string()).query(({ input }) => {
    return users[input]; // input type is string
  }),
  createUser: t.procedure
    // validate input with Zod
    .input(
      z.object({
        name: z.string().min(3),
        bio: z.string().max(142).optional(),
      }),
    )
    .mutation(({ input }) => {
      const id = Date.now().toString();
      const user: User = { id, ...input };
      users[user.id] = user;
      return user;
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;

function handler(request: Request) {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: request,
    router: appRouter,
    createContext,
  });
}
serve(handler, { port: 3333 });