import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignUpForm } from "./_form";

export default async function SignUpPage() {
  const session = await auth();
  if (session?.user) redirect("/explore");
  return <SignUpForm />;
}

