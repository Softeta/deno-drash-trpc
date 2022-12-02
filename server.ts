import { Server } from "https://deno.land/x/drash@v2.7.1/mod.ts";

import { TrpcResource } from "./resources/trpc.ts";

// Create and run your server
const server = new Server({
  hostname: "localhost",
  port: 1447,
  protocol: "http",
  resources: [TrpcResource],
});

server.run();

console.log(`Server running at ${server.address}.`);
