import { Resource, Request, Response } from "https://deno.land/x/drash@v2.7.1/mod.ts";
import { drashHandler } from "../drashAdapter/adapter.ts";
import { appRouter, createContext } from "../trpc.ts";

export const trpcNamespace = "/trpc";

export class TrpcResource extends Resource {
  public paths = [`${trpcNamespace}.*`];
  
  public async GET(request: Request, response: Response): Promise<void> {
    const res = await drashHandler({
      endpoint: trpcNamespace,
      req: request,
      router: appRouter,
      createContext,
    });
      
    return response.send('application/json', await res.text());
  }
}