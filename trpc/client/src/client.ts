import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../../server/index";

const client = createTRPCProxyClient<AppRouter>({
    links: [httpBatchLink({
        url: "http://localhost:5000/trpc"
    })]
});

export default client;