import { DashboardContainer } from "@/components/DashboardContainer";
import { DataBlockWithCopy } from "@/components/requirements/DataBlockWithCopy";
import { Anchor } from "@/components/ui/Anchor";
import { buttonVariants } from "@/components/ui/Button";

// TODO: simple compound component when design is certain

const ErrorPage = ({
  title,
  description,
  correlationId,
  errorCode,
}: {
  title: string;
  description: string;
  correlationId?: string;
  errorCode: string;
}) => {
  return (
    <div className="relative h-screen">
      <DashboardContainer className="flex size-full flex-col">
        <main className="mx-auto flex h-full max-w-prose flex-col items-center justify-center text-center">
          <h1 className="mb-4 text-pretty font-bold font-display text-4xl">
            {title}
          </h1>
          <p className="mb-12 text-balance text-foreground-dimmed text-lg">
            {description}
          </p>
          <Anchor
            variant={"unstyled"}
            href="/"
            className={buttonVariants({
              variant: "solid",
              colorScheme: "primary",
            })}
          >
            Return Home
          </Anchor>
        </main>
        <footer className="mt-auto pb-8 text-center text-foreground-secondary text-xs sm:text-sm">
          {correlationId && (
            <code>
              correlation id: <DataBlockWithCopy text={correlationId} />
            </code>
          )}
        </footer>
      </DashboardContainer>
      <div className="-translate-y-1/2 -z-10 absolute top-1/2 w-full overflow-hidden text-center">
        <div
          className="font-black text-[clamp(128px,32vw,360px)] text-foreground leading-none tracking-tight opacity-20"
          aria-hidden
        >
          {errorCode}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background" />
      </div>
    </div>
  );
};

export { ErrorPage };
