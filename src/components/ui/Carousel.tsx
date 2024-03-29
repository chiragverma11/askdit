"use client";

import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  totalSlides: number;
  currentSlide: number;
  scrollTo: (index: number, jump?: boolean) => void;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const [totalSlides, setTotalSlides] = React.useState(0);
    const [currentSlide, setCurrentSlide] = React.useState(0);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());

      setCurrentSlide(api.selectedScrollSnap());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const scrollTo = React.useCallback(
      (index: number, jump?: boolean) => {
        api?.scrollTo(index, jump);
      },
      [api],
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      setTotalSlides(api.scrollSnapList().length);

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          totalSlides,
          currentSlide,
          scrollTo,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

interface CarouselControlsProps {
  position?: "inside" | "outside";
}

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & CarouselControlsProps
>(
  (
    {
      className,
      variant = "outline",
      size = "icon",
      position = "inside",
      ...props
    },
    ref,
  ) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? position === "outside"
              ? "-left-12 top-1/2 -translate-y-1/2"
              : "left-4 top-1/2 -translate-y-1/2"
            : position === "outside"
            ? "-top-12 left-1/2 -translate-x-1/2 rotate-90"
            : "left-1/2 top-4 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ChevronLeft className="h-3/4 w-3/4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  },
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & CarouselControlsProps
>(
  (
    {
      className,
      variant = "outline",
      size = "icon",
      position = "inside",
      ...props
    },
    ref,
  ) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? position === "outside"
              ? "-right-12 top-1/2 -translate-y-1/2"
              : "right-4 top-1/2 -translate-y-1/2"
            : position === "outside"
            ? "-bottom-12 left-1/2 -translate-x-1/2 rotate-90"
            : "bottom-4 left-1/2 -translate-x-1/2 rotate-90",
          className,
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ChevronRight className="h-3/4 w-3/4" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  },
);
CarouselNext.displayName = "CarouselNext";

const CarouselSlideCounter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { currentSlide, totalSlides } = useCarousel();
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div
      ref={ref}
      role="counter"
      aria-roledescription="slide-counter"
      className={cn(
        "absolute right-2 top-2 flex select-none justify-center rounded-full bg-black/40 px-2 py-1 text-white transition-opacity duration-300",
        show ? "opacity-100" : "opacity-0",
        className,
      )}
      {...props}
    >
      <span className="text-sm tabular-nums">
        {currentSlide + 1}/{totalSlides}
      </span>
    </div>
  );
});
CarouselSlideCounter.displayName = "CarouselSlideCounter";

const CarouselSlideSelectorDot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { currentSlide, totalSlides, scrollTo } = useCarousel();
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div
      ref={ref}
      role="selector"
      aria-roledescription="slide-selector"
      className={cn(
        "absolute bottom-4 left-0 right-0 z-[1] flex justify-center gap-1.5 rounded-full text-white transition-opacity duration-300",
        show ? "opacity-100" : "opacity-0",
        className,
      )}
      {...props}
    >
      {Array.from({ length: totalSlides }).map((_, index) => {
        const isSelected = currentSlide === index;

        return (
          <Circle
            key={index}
            className={cn(
              "h-2.5 w-2.5 stroke-[2.5]",
              isSelected && "fill-white",
            )}
            onClick={() => scrollTo(index)}
          />
        );
      })}
    </div>
  );
});
CarouselSlideSelectorDot.displayName = "CarouselSlideSelectorDot";

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselSlideCounter,
  CarouselSlideSelectorDot,
  type CarouselApi,
};
