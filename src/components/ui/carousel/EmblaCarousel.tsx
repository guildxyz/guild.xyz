"use client";
import { cn } from "@/lib/cssUtils";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { useDotButton } from "./useDotButton";

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;

    resetOrStop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick,
  );

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi, onNavButtonClick);

  return (
    <section className="mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex touch-pan-y">
          {slides.map((index) => (
            <div
              className="min-w-0 flex-[0_0_100%] transform-gpu pl-4"
              key={index}
            >
              <div className="flex h-[440px] select-none items-center justify-center rounded-3xl bg-card-secondary font-semibold text-6xl shadow-[inset_0_0_0_0.2rem_var(--detail-medium-contrast)]">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-[auto_1fr] justify-between gap-2">
        <div className="grid grid-cols-2 items-center gap-[0.6rem]">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-1 ">
          {scrollSnaps.map((num, index) => (
            <button
              key={num}
              onClick={() => onDotButtonClick(index)}
              className={cn(
                "flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-blackAlpha-medium dark:border-whiteAlpha-medium",
                {
                  "border-black dark:border-white": index === selectedIndex,
                },
              )}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
