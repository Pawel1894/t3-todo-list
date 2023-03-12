import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Josefin_Sans } from "next/font/google";
import ThemeToggler from "~/components/ThemeToggler";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const josefin = Josefin_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-josefin",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <header
        className={`${josefin.variable} h-[12.5rem] bg-mobile-header bg-cover bg-no-repeat px-[1.625rem]  font-sans dark:bg-dark-mobile-header sm:h-[18.75rem] sm:bg-desktop-header sm:dark:bg-dark-desktop-header`}
      >
        <div className="mx-auto flex max-w-xl items-center justify-between pt-12">
          <h1 className="pt-1 text-3xl font-bold leading-[0px] tracking-[0.2em] text-white sm:mt-[0.1875rem] sm:text-4xl sm:leading-[0]">
            TODO
          </h1>
          <ThemeToggler />
        </div>
      </header>
      <main className={`${josefin.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
      <ReactQueryDevtools initialIsOpen={false} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
