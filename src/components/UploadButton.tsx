"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import Dropzone from "react-dropzone";
import { Cloud, File, Loader2 } from "lucide-react";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "./ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

const UploadButton = () => {
  const [isopen, setIsopen] = useState(false);
  return (
    <Dialog
      open={isopen}
      onOpenChange={(v) => {
        if (!v) {
          setIsopen(v);
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsopen(true)}>
        <Button>Upload Pdf</Button>
      </DialogTrigger>
      <DialogContent>
        <DropZoneContainer />
        {/* <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone> */}
      </DialogContent>
    </Dialog>
  );
};
const DropZoneContainer = () => {
  const router = useRouter();
  const { startUpload } = useUploadThing("pdfUploader");
  const { toast } = useToast();
  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });
  const [isUploading, setIsUploading] = useState<boolean | null>(false);
  const [uploadProgrss, setUploadProgress] = useState<number>(0);

  const startProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 80) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);
    return interval;
  };
  return (
    <Dropzone
      multiple={false}
      onDrop={async (file) => {
        setIsUploading(true);
        const progressInterval = startProgress();
        // await new Promise((resolve) => setTimeout(resolve,10000))
        const res = await startUpload(file);
        if (!res) {
          return toast({
            title: "Something went wrong",
            description: "Pleas try again later",
            variant: "destructive",
          });
        }
        const [fileResponse] = res;

        const key = fileResponse?.key;

        if (!key) {
          return toast({
            title: "Something went wrong",
            description: "Pleas try again later",
            variant: "destructive",
          });
        }

        clearInterval(progressInterval);
        setUploadProgress(100);
        startPolling({ key });
      }}
    >
      {({ getInputProps, getRootProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg dark:bg-black/50"
        >
          <input {...getInputProps()} type="file" className="hidden" />
          <div className="flex items-center justify-center h-full w-full select-none bg-transparent">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 dark:bg-zinc-950  hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 select-none">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2 dark:text-zinc-200 " />
                <p className="mb-2 text-sm text-zinc-700  dark:text-zinc-200 select-none">
                  <span className="font-semibold select-none">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-zinc-500  dark:text-zinc-200 select-none">
                  PDF (up to 4 MB)
                </p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs dark:bg-black/80 blurry flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200 select-none">
                  <div className="px-3 py-2   h-full grid place-items-center">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="px-3 py-2   h-full text-sm truncate dark:text-white">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}
              {isUploading ? (
                <div className=" w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    indicatorColor={
                      uploadProgrss === 100 ? "bg-green-500" : "bg-blue-400"
                    }
                    value={uploadProgrss}
                    className="h-1 w-full bg-zinc-200 dark:bg-black"
                  />
                  {uploadProgrss === 100 ? (
                    <div className=" flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <Loader2 className=" h-3 w-3 animate-spin" />
                      Redirecting.....
                    </div>
                  ) : null}
                </div>
              ) : null}
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};
export default UploadButton;
