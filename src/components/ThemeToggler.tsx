import React, { useState } from "react";
import Image from "next/image";

export default function ThemeToggler() {
  const [isDark, setIsDark] = useState(false);
  function toggleTheme() {
    setIsDark((prevState) => !prevState);
    document.getElementsByTagName("body")[0]?.classList.toggle("dark");
  }

  return (
    <button onClick={toggleTheme} className={"relative h-5 w-5 sm:h-7 sm:w-7"}>
      <Image
        src={isDark ? "/images/icon-moon.svg" : "/images/icon-sun.svg"}
        alt="click here to turn on dark mode"
        fill
      />
    </button>
  );
}
