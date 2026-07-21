import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm">
            <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            Now in public beta
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Build something{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              extraordinary
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            The modern platform that helps teams ship faster. From idea to
            production in minutes, not months. Designed for developers who value
            simplicity and speed.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="xl" className="group">
              Start Building
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="xl" className="group">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 border-t pt-10">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">10k+</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Active developers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">99.9%</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Uptime SLA
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">50ms</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Avg response
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
