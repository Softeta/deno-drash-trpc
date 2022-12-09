import { Resource, Request, Response } from '../deps.ts';
import { drashHandler } from '../drashAdapter/adapter.ts';
import { appRouter, createContext } from '../trpc.ts';

export const trpcNamespace = '/trpc';

export class TrpcResource extends Resource {
  public paths = [`${trpcNamespace}.*`];

  private handler = async (req: Request, res: Response) => await drashHandler({
    endpoint: trpcNamespace,
    req,
    res,
    router: appRouter,
    createContext,
  });

  public async GET(request: Request, response: Response): Promise<void> {
    await this.handler(request, response);
  }

  public async POST(request: Request, response: Response): Promise<void> {
    await this.handler(request, response);
  }

  public async DELETE(request: Request, response: Response): Promise<void> {
    await this.handler(request, response);
  }

  public async PATCH(request: Request, response: Response): Promise<void> {
    await this.handler(request, response);
  }

  public async PUT(request: Request, response: Response): Promise<void> {
    await this.handler(request, response);
  }
}
