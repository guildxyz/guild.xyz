"use client";

import { ScrollBar } from "@/components/ui/ScrollArea";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import type { PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";

const FadedScrollArea = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  const margin = 40;

  const [isScrolled, setIsScrolled] = useState(0);
  const [remainingScroll, setRemainingScroll] = useState(margin);

  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (viewportRef.current) {
        const viewport = viewportRef.current;
        setIsScrolled(viewport.scrollLeft);

        const remaining =
          viewport.scrollWidth - viewport.clientWidth - viewport.scrollLeft;
        setRemainingScroll(remaining);
      }
    };

    const viewport = viewportRef.current;
    if (viewport) {
      viewport.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (viewport) {
        viewport.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <ScrollAreaPrimitive.Root
      className={className}
      style={{
        WebkitMaskImage: `linear-gradient(to right, rgba(0,0,0,${(margin - isScrolled) / margin}), black ${margin}px, black calc(100% - ${margin}px), rgba(0,0,0,${(margin - remainingScroll) / margin})`,
      }}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        className="h-full w-full rounded-[inherit]"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
};

export default FadedScrollArea;
