import SignInCard from "~/components/SignInCard";
import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LoadIndicator from "~/components/LoadIndicator";

const Home: NextPage = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <LoadIndicator />
      </div>
    );
  }

  if (status === "authenticated") {
    void router.push("/task");
    return null;
  }

  return (
    <>
      <Head>
        <title>Welcome to T3 Todo list</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative z-10 mx-auto max-w-xl">
        <SignInCard />
      </div>
    </>
  );
};

export default Home;
