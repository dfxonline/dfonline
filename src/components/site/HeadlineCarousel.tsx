import { useEffect, useState } from "react";
import type { Article } from "@/lib/news-types";
import { Button } from "@/components/ui/button";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi,
} from "@/components/ui/carousel";
import { HeroCard } from "./NewsCard";
import { cn } from "@/lib/utils";

export function HeadlineCarousel({ articles }: { articles: Article[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!api) return;
    const select = () => setActive(api.selectedScrollSnap());
    select();
    api.on("select", select);
    api.on("reInit", select);
    return () => {
      api.off("select", select);
      api.off("reInit", select);
    };
  }, [api]);

  return (
    <Carousel opts={{ loop: articles.length > 1, duration: 0 }} setApi={setApi} aria-label="Principais notícias" className="min-w-0">
      <CarouselContent>
        {articles.map((article, index) => (
          <CarouselItem key={article.id} aria-label={`${index + 1} de ${articles.length}`} aria-hidden={index !== active} inert={index !== active}>
            <HeroCard a={article} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {articles.length > 1 && (
        <div className="mt-3 flex h-10 items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            {articles.map((article, index) => (
              <Button key={article.id} variant="ghost" size="icon" className="h-8 w-8" aria-label={`Ver manchete ${index + 1}`} aria-current={index === active ? "true" : undefined} title={article.title} onClick={() => api?.scrollTo(index)}>
                <span className={cn("h-2 w-2 rounded-full", index === active ? "bg-primary" : "bg-border")} />
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-1 text-xs text-muted-foreground" aria-live="polite">{active + 1} / {articles.length}</span>
            <CarouselPrevious variant="default" aria-label="Manchete anterior" title="Manchete anterior" className="static h-9 w-9 translate-y-0 rounded-md" />
            <CarouselNext variant="default" aria-label="Próxima manchete" title="Próxima manchete" className="static h-9 w-9 translate-y-0 rounded-md" />
          </div>
        </div>
      )}
    </Carousel>
  );
}