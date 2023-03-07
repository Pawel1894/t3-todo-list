import React from "react";
import SignIn from "./SignIn";

export default function SignInCard() {
  return (
    <div className="mx-auto w-11/12 -translate-y-16 rounded-md bg-white py-6 px-5  shadow-lg dark:bg-dark-200 dark:text-white sm:-translate-y-28">
      <p className="mb-6 text-center text-lg">
        Welcome to todo list app made on top of t3-stack
      </p>
      <SignIn provider="discord" />
      <HorizontalLine />
      <SignIn provider="github" />
    </div>
  );
}

function HorizontalLine() {
  return (
    <div className="flex items-center gap-x-2 py-3">
      <span className="h-[0.0625rem] w-full bg-light-300"></span>
      <span className="text-lg text-light-400">or</span>
      <span className="h-[0.0625rem] w-full bg-light-300"></span>
    </div>
  );
}
