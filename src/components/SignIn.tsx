import { signIn } from "next-auth/react";
type props = {
  provider: "github" | "discord";
};

export default function SignIn({ provider }: props) {
  return (
    <button
      className="w-full rounded-md border border-light-300 px-3 py-2 shadow-md"
      onClick={() => void signIn(provider)}
    >
      Sign in with <span className="capitalize">{provider}</span>
    </button>
  );
}
