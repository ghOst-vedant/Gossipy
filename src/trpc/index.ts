import { TRPCError } from '@trpc/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/db';
import { z } from 'zod'
export const appRouter =  router({
  authCallback: publicProcedure.query(async()=>{
      const {userId} =auth()
      const user=await clerkClient.users.getUser(userId as string)
      // const email =user.emailAddresses[0].emailAddress
      if(!userId)
        throw new TRPCError({code:'UNAUTHORIZED'})
      const dbUser=await  db.user.findFirst({
        where:{
          id:userId
        }
      })
      if (!dbUser) {
        //  so the user is not in the database.
        //  hence we create user in neon now 
        await db.user.create({
            data:{
              id:userId,
              email:user.emailAddresses[0].emailAddress,
            }
        })
      }
    return true
  }),
  getUserFiles: privateProcedure.query(async({ctx})=>{
    const { userId }=ctx
    
    return await db.file.findMany({
      where:{
        userId
      }
    })
  }),
  deleteFile: privateProcedure.input(z.object({id:z.string()})).mutation(async({ctx,input})=>{
    const {userId} =ctx
    const file = await db.file.findFirst({
      where:{
        id:input.id,
        userId,
      }
    })
    if(!file) {
      throw new TRPCError({code: 'NOT_FOUND'})
    }
    
    await db.file.delete({
      where:{
        id:input.id,
      }})
      return file
  }),
  getFile:privateProcedure.input(z.object({key:z.string()})).mutation(async({ctx,input})=>{
    const {userId} =ctx;

    const file=await db.file.findFirst({
      where:{
        key:input.key,
        userId
      }
    })
    if(!file) {
      throw new TRPCError({code:"NOT_FOUND"}) 
    }
  return file
  }),
});

export type AppRouter = typeof appRouter;