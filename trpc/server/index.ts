// This is the previous version of the backend code for your reference.
// import express, { Request, Response } from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { initTRPC } from "@trpc/server";
// import { createExpressMiddleware} from "@trpc/server/adapters/express";
// 
// dotenv.config();
// 
// const t = initTRPC.create();
// 
// const appRouter =t.router({
//   sayHi: t.procedure.query(() => {
//     return "Hey from the Api!"
//   }),
//   getUsers: t.procedure.query((): User[] => {
//     return [{ id: 1, name: 'John Doe', email: 'john@example.com' },
//     { id: 2, name: 'Jane Smith', email: 'jane@example.com' }];
//   }),
//   logToServer: t.procedure.input(v => {
//     if ( typeof v === "string" ) return v;
// 
//     throw new Error("Invalid input");
// 
//   }).mutation(req => {
//     console.log(`Client says: ${req.input}`);
//     return true;
//   })
// });
// 
// const app = express();
// const PORT: number = parseInt(process.env.PORT || '5000', 10);
// 
// // Middleware
// app.use(cors());
// app.use(express.json());
// 
// // Types
// interface User {
//   id: number;
//   name: string;
//   email: string;
// }
// 
// //Trpc Routes
// app.use("/trpc", createExpressMiddleware({ router: appRouter }))
// 
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// }); 
// 
// 
// export type AppRouter = typeof appRouter;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { z } from 'zod';

dotenv.config();

// Initialize tRPC
const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

// In-memory "database" for users
const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Define User type for TypeScript
interface User {
    id: number;
    name: string;
    email: string;
}

// User-related tRPC router
const userRouter = router({
    // Query to get all users
    getUsers: publicProcedure.query(() => {
        return users;
    }),

    // Query to get a single user by ID with input validation
    getUserById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(({ input }) => {
            const user = users.find(u => u.id === input.id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        }),

    // Mutation to create a new user with input validation
    createUser: publicProcedure
        .input(z.object({
            name: z.string().min(3),
            email: z.string().email(),
        }))
        .mutation(({ input }) => {
            const newUser: User = {
                id: Math.max(...users.map(u => u.id)) + 1,
                name: input.name,
                email: input.email,
            };
            users.push(newUser);
            return newUser;
        }),
});

// Main application router that merges other routers
const appRouter = router({
    // A simple query procedure
    sayHi: publicProcedure.query(() => {
        return "Hey from the Api!";
    }),

    // A simple mutation for logging
    logToServer: publicProcedure
        .input(z.string())
        .mutation(req => {
            console.log(`Client says: ${req.input}`);
            return true;
        }),
    
    // Merge the user router under a 'users' namespace
    users: userRouter,
});

const app = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Express middleware
app.use(cors());
app.use(express.json());

// tRPC middleware
app.use("/trpc", createExpressMiddleware({ router: appRouter }));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export the router's type signature for the client
export type AppRouter = typeof appRouter;
