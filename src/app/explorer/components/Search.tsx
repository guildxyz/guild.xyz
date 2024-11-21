"use client";

import { Input } from "@/components/ui/Input";
import { useDebouncedValue } from "foxact/use-debounced-value";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [value, setValue] = useState(
    searchParams?.get("search")?.toString() || "",
  );
  const _debouncedValue = useDebouncedValue(value, 200);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(
      Object.entries({ search: value }).filter(([_, value]) => value),
    );

    router.replace(`${pathname}?${newSearchParams.toString()}`, {
      scroll: false,
    });
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
