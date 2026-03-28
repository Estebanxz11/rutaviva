import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignInForm } from "./_form";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) redirect("/explore");
  return <SignInForm />;
}

