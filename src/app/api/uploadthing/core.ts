
import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";


const f = createUploadthing();

export const ourFileRouter = {

    pdfUploader: f({ pdf: { maxFileSize: "4MB" } })

        .middleware(async ({ req }) => {
            const { userId } = auth()
            if (!userId) throw new Error("Unauthorized")
            return { userId: userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const createdFile =await db.file.create({
                data:{
                    key:file.key,
                    name:file.name,
                    userId:metadata.userId,
                    url:`https://uploadthing/prod.s3.us-west-2.amazonaws.com/${file.key}`,
                    uploadStatus:'PROCESSING'
                }
            })

        }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;