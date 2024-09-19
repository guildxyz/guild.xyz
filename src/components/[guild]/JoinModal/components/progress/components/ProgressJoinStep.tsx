import { Collapsible, CollapsibleContent } from "@/components/ui/Collapsible"
import { cn } from "@/lib/utils"
import { HTMLAttributes, PropsWithChildren, ReactNode } from "react"
import { JoinStepIndicator } from "../../JoinStepIndicator"

type Props = {
  title: string
  countLabel: string
  fallbackText: string | JSX.Element
  status: "INACTIVE" | "LOADING" | "NO_ACCESS" | "DONE"
  total?: number
  current?: number
  waitingPosition?: number
  RightComponent?: ReactNode
}

const ProgressJoinStep = ({
  title,
  countLabel,
  fallbackText,
  status,
  total,
  current,
  waitingPosition,
  RightComponent,
  className,
  ...props
}: PropsWithChildren<Props> & HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-start gap-2.5 py-2.5", className)} {...props}>
    <div
      className={cn("flex h-11 items-center justify-center", {
        "h-6": status === "INACTIVE",
      })}
    >
      <JoinStepIndicator
        status={status === "LOADING" && current && total ? "PROGRESS" : status}
        progress={(current / total) * 100}
      />
    </div>

    <div className="flex w-full flex-col">
      <span className="font-bold">{title}</span>

      {status !== "INACTIVE" &&
        (typeof total === "number" && typeof current === "number" ? (
          <p>{`${current}/${total} ${countLabel}`}</p>
        ) : (
          <p className="text-muted-foreground">{fallbackText}</p>
        ))}

      <Collapsible open={status === "LOADING" && !!waitingPosition}>
        <CollapsibleContent>
          <p className="text-muted-foreground">
            {`There are a lot of users joining right now, so you have to wait a bit. There are ${waitingPosition} users ahead of you. Feel free to close the site and come back later!`}
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
    {RightComponent}
  </div>
)

export { ProgressJoinStep }
