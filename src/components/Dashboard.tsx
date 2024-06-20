"use client";

import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import UploadButton from "./UploadButton";
import { trpc } from "@/app/_trpc/client";
import { formatDate } from "date-fns";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";

const Dashboard = () => {
  const [nowDeleting, setNowDeleting] = useState<string | null>(null);
  const utils = trpc.useUtils();
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();
  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate({ id }) {
      setNowDeleting(id);
    },
    onSettled() {
      setNowDeleting(null);
    },
  });
  return (
    <main className=" mx-auto max-w-7xl md:p-10">
      <div className=" mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className=" mb-3 font-bold text-5xl text-gray-900 dark:text-white">
          {" "}
          My Files
        </h1>
        <UploadButton />
      </div>

      {/* User file section */}
      {files && files?.length != 0 ? (
        <ul className=" mt-8 grid grid-cols-1 gap-6  md:grid-cols-2 lg:grid-cols-3 divide-zinc-200 ">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y border dark:border-none divide-gray-200 dark:divide-zinc-600 rounded-lg bg-white dark:bg-zinc-900 transition hover:shadow-lg "
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className=" flex flex-col gap-2 "
                >
                  <div className=" flex justify-between  items-center w-full pt-6 px-6 space-x-6 ">
                    <div className=" h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r to-gray-400 dark:to-gray-900 dark:from-zinc-700 from-zinc-900 dark:border" />
                    <div className=" flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className=" truncate text-gl font-medium text-zinc-900 dark:text-zinc-100">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className=" px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className=" flex items-center gap-2  dark:text-zinc-200">
                    <Plus className="h-4 w-4 dark:text-zinc-100" />
                    {formatDate(new Date(file.createdAt), "MMM yyy")}
                  </div>
                  <div className=" flex items-center gap-2  dark:text-zinc-200">
                    <MessageSquare className="h-4 w-4 dark:text-zinc-100" />
                    mocked
                  </div>
                  <Button
                    size="sm"
                    className="w-full dark:bg-gray-200 "
                    variant={"destructive"}
                    onClick={() => deleteFile({ id: file.id })}
                  >
                    {nowDeleting === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className=" mt-16 flex flex-col items-center gap-2">
          <Ghost className=" h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">
            This place is waiting for your first PDF upload.....
          </h3>
          <p> Let's fill it with something amazing! </p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
