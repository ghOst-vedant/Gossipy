
import { auth } from '@clerk/nextjs/server';
import { TRPCError, initTRPC } from '@trpc/server';


const t = initTRPC.create();
const middleware=t.middleware
const isAuth=middleware(async(options)=>{
    const {userId}=auth();
    if (!userId) {
        throw new TRPCError({code:'UNAUTHORIZED'})
    }
    return options.next({
        ctx:{
            userId:userId,
        }
    })
})
export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure =t.procedure.use(isAuth)