import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SponsoredContentItem } from "@/hooks/networking/content/sponsored-content";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  SearchX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type SponsoredSliderProps = {
  items?: SponsoredContentItem[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  collapsed?: boolean;
  onToggle?: () => void;
  autoScrollIntervalMs?: number;
};

const buildGradient = (colors?: string[]) => {
  if (!colors || colors.length === 0) {
    return "linear-gradient(135deg, #0f172a, #111827)";
  }

  const safe = colors.map(color =>
    color.startsWith("#") ? color : `#${color}`
  );
  const [first, second = first, third = second] = safe;
  return `linear-gradient(135deg, ${first}, ${second}, ${third})`;
};

export function SponsoredSlider({
  items = [],
  isLoading,
  isError,
  onRetry,
  collapsed,
  onToggle = () => {},
  autoScrollIntervalMs = 6000,
}: SponsoredSliderProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const canScroll = !isLoading && !isError && items.length > 0;

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const offset =
      direction === "left" ? -clientWidth * 0.9 : clientWidth * 0.9;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  useEffect(() => {
    if (!canScroll || collapsed) return;

    const id = setInterval(() => {
      if (!scrollRef.current || isHovered) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const atEnd = scrollLeft + clientWidth + 16 >= scrollWidth;
      if (atEnd) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroll("right");
      }
    }, autoScrollIntervalMs);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canScroll, collapsed, isHovered, autoScrollIntervalMs]);

  if (collapsed) {
    return null;
  }

  const renderCards = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, idx) => (
        <Card
          key={`sponsored-skeleton-${idx}`}
          className="min-w-[85vw] sm:min-w-[320px] md:min-w-[340px] lg:min-w-[360px] snap-start overflow-hidden border border-border/40 bg-muted/40"
        >
          <div className="flex gap-3 items-center p-4">
            <Skeleton className="w-14 h-14 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-5/6 h-3" />
            </div>
          </div>
        </Card>
      ));
    }

    if (isError) {
      return (
        <div className="flex flex-col gap-3 justify-center items-center p-6 min-w-full rounded-lg border border-border/60 bg-muted/30 text-muted-foreground">
          <AlertTriangle className="w-8 h-8" />
          <p className="text-sm text-center">
            We could not load sponsored highlights right now.
          </p>
          {onRetry && (
            <Button size="sm" variant="outline" onClick={onRetry}>
              Try again
            </Button>
          )}
        </div>
      );
    }

    if (!items.length) {
      return (
        <div className="flex flex-col gap-3 justify-center items-center p-6 min-w-full rounded-lg border border-border/60 bg-muted/30 text-muted-foreground">
          <SearchX className="w-8 h-8" />
          <p className="text-sm text-center">No sponsored content right now.</p>
        </div>
      );
    }

    return items.map((item, idx) => {
      const gradient = buildGradient(item.accentColor);
      return (
        <Card
          key={`${item.title}-${idx}`}
          className="min-w-[85vw] sm:min-w-[320px] md:min-w-[340px] lg:min-w-[360px] snap-start overflow-hidden border-none shadow-md text-white"
          style={{ background: gradient }}
        >
          <div className="flex gap-3 items-start p-4">
            <div className="overflow-hidden w-14 h-14 rounded-xl border shrink-0 border-white/10 bg-white/10">
              {item.imgUrl ? (
                <img
                  src={item.imgUrl}
                  alt={item.title}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              ) : (
                <div className="flex justify-center items-center w-full h-full text-xs text-white/70">
                  {item.title?.[0] ?? "•"}
                </div>
              )}
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <div className="flex gap-2 items-center">
                <p className="text-base font-semibold leading-tight">
                  {item.title}
                </p>
                {item.type && (
                  <Badge className="text-white bg-white/20" variant="secondary">
                    {item.type}
                  </Badge>
                )}
              </div>
              {item.description && (
                <p className="text-sm line-clamp-3 text-white/80">
                  {item.description}
                </p>
              )}
              {item.url && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-white w-fit bg-white/20 hover:bg-white/30"
                  asChild
                >
                  <a href={item.url} target="_blank" rel="noreferrer">
                    Visit <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </Card>
      );
    });
  };

  return (
    <div className="mx-auto space-y-3 w-full max-w-5xl">
      <div className="flex gap-3 justify-between items-center">
        <div className="flex flex-col">
          <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
            Featured & sponsored
          </span>
          <h2 className="text-xl font-semibold">Highlights</h2>
        </div>
        {canScroll && (
          <div className="hidden gap-2 items-center md:flex">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScroll}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScroll}
            >
              <ChevronRight />
            </Button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className={cn(
          "flex gap-4 overflow-x-auto pb-2",
          "snap-x snap-mandatory scroll-smooth",
          "[-ms-overflow-style:none] [scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {renderCards()}
      </div>
    </div>
  );
}

export default SponsoredSlider;
