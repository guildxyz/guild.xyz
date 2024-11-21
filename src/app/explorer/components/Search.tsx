"use client";

import { Input } from "@/components/ui/Input";
import { useDebouncedValue } from "foxact/use-debounced-value";
import { useSetAtom } from "jotai";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchAtom } from "../atoms";

export const Search = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [value, setValue] = useState(
    searchParams?.get("search")?.toString() || "",
  );

  const debouncedValue = useDebouncedValue(value, 200);
  const setSearch = useSetAtom(searchAtom);

  useEffect(() => {
    setSearch(debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(
      Object.entries({ search: value }).filter(([_, value]) => value),
    );
    window.history.replaceState(
      null,
      "",
      `${pathname}?${newSearchParams.toString()}`,
    );
  }, [value]);

  return (
    <Input
      placeholder="Search guild.xyz"
      size="lg"
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
    />
  );
};
