import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { auth, clerkClient, currentUser, getAuth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const { userId } = auth();
  const user = await clerkClient.users.getUser(userId as string);
  const email = user.emailAddresses[0].emailAddress;
  if (!user || !userId) redirect(`/auth-callback?origin=dashboard`);
  const dbUser = db.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!dbUser) redirect(`/auth-callback?origin=dashboard`);
  return <Dashboard />;
};

export default page;
