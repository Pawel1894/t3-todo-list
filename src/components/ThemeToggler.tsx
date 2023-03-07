import React from "react";
import Image from "next/image";

export default function ThemeToggler() {
  return (
    <button>
      <Image
        src={"/images/icon-moon.svg"}
        width={20}
        height={20}
        alt="click here to turn on dark mode"
      />
    </button>
  );
}
