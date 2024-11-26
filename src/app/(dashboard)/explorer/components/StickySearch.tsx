"use client";

import { Input } from "@/components/ui/Input";
import useIsStuck from "@/hooks/useIsStuck";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { useDebouncedValue } from "foxact/use-debounced-value";
import { useSetAtom } from "jotai";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { isSearchStuckAtom, searchAtom } from "../atoms";

const Search = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [value, setValue] = useState(
    searchParams?.get("search")?.toString() || "",
  );

  const debouncedValue = useDebouncedValue(value, 200);
  const setSearch = useSetAtom(searchAtom);

  useEffect(() => {
    setSearch(debouncedValue);
  }, [debouncedValue, setSearch]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(
      Object.entries({ search: value }).filter(([_, value]) => value),
    );
    window.history.replaceState(
      null,
      "",
      [pathname, newSearchParams.toString()].filter(Boolean).join("?"),
    );
  }, [value, pathname]);

  return (
    <div className="relative flex flex-col gap-3 sm:flex-row sm:gap-0">
      <Input
        className="relative h-12 grow rounded-xl border pr-6 pl-10 text-md"
        size="lg"
        placeholder="Search verified guilds"
        onChange={({ currentTarget }) => setValue(currentTarget.value)}
        value={value}
      />
      <div className="absolute left-4 flex h-12 items-center justify-center">
        <MagnifyingGlass className="text-foreground-secondary" />
      </div>
    </div>
  );
};

export const StickySearch = () => {
  const setIsSearchStuck = useSetAtom(isSearchStuckAtom);
  const { ref: searchRef } = useIsStuck(setIsSearchStuck);

  return (
    <div className="sticky top-12 z-10" ref={searchRef}>
      <Suspense>
        <Search />
      </Suspense>
    </div>
  );
};