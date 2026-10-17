import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import SignupForm from "./signupForm";

const SignupPage = async () => {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) redirect("/account");
  return <SignupForm />;
};

export default SignupPage;