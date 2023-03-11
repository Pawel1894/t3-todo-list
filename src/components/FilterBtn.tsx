import React from "react";
import { z } from "zod";
import { FiltersEnum } from "~/types/enums";

const zProps = z.object({
  activeFilter: FiltersEnum,
  setActiveFilter: z.function().args(FiltersEnum).returns(z.void()),
  label: FiltersEnum,
  type: FiltersEnum,
});

type Props = z.infer<typeof zProps>;

export default function FilterBtn({
  activeFilter,
  setActiveFilter,
  label,
  type,
}: Props) {
  return (
    <button
      className={activeFilter === type ? "text-primary-100" : ""}
      onClick={() => setActiveFilter(type)}
    >
      {label}
    </button>
  );
}
