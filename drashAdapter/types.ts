import {
  AnyRouter,
  inferRouterContext,
  inferRouterError,
  ProcedureType,
  TRPCError,
  TRPCResponse,
  ResponseMeta,
  Request,
  Response,
} from '../deps.ts';

export declare type ResponseMetaFn<TRouter extends AnyRouter> = (opts: {
  data: TRPCResponse<unknown, inferRouterError<TRouter>>[];
  ctx?: inferRouterContext<TRouter>;
  /**
   * The different tRPC paths requested
   */
  paths?: string[];
  type: ProcedureType | 'unknown';
  errors: TRPCError[];
}) => ResponseMeta;

export type OnErrorFunction<TRouter extends AnyRouter, TRequest> = (opts: {
  error: TRPCError;
  type: ProcedureType | 'unknown';
  path: string | undefined;
  req: TRequest;
  input: unknown;
  ctx: undefined | inferRouterContext<TRouter>;
}) => void;

export interface BaseHandlerOptions<TRouter extends AnyRouter, TRequest> {
  onError?: OnErrorFunction<TRouter, TRequest>;
  batching?: {
    enabled: boolean;
  };
  router: TRouter;
}

export interface HTTPBaseHandlerOptions<TRouter extends AnyRouter, TRequest>
  extends BaseHandlerOptions<TRouter, TRequest> {
  /**
   * Add handler to be called before response is sent to the user
   * Useful for setting cache headers
   * @link https://trpc.io/docs/caching
   */
  responseMeta?: ResponseMetaFn<TRouter>;
}

export type CreateContextFnOptions = {
  req: Request;
};

export type CreateContextFn<TRouter extends AnyRouter> = (opts: {
  req: Request;
}) => inferRouterContext<TRouter> | Promise<inferRouterContext<TRouter>>;

export type CreateContextOption<TRouter extends AnyRouter> = unknown extends
  inferRouterContext<TRouter> ? {
    /**
     * @link https://trpc.io/docs/context
     */
    createContext?: CreateContextFn<TRouter>;
  }
  : {
    /**
     * @link https://trpc.io/docs/context
     */
    createContext: CreateContextFn<TRouter>;
  };

export type DrashHandlerOptions<TRouter extends AnyRouter> =
  & HTTPBaseHandlerOptions<TRouter, Request>
  & CreateContextOption<TRouter>;

export type DrashRequestHandlerOptions<TRouter extends AnyRouter> = {
  req: Request;
  res: Response;
  endpoint: string;
} & DrashHandlerOptions<TRouter>;
