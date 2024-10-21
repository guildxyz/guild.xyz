import { CircularProgressBar } from "@/components/CircularProgressBar"
import { Check, CircleNotch, X } from "@phosphor-icons/react/dist/ssr"

export type JoinStepIndicatorProps =
  | { status: "INACTIVE" | "DONE" | "NO_ACCESS" | "LOADING" }
  | { status: "PROGRESS"; progress: number }

const JoinStepIndicator = (props: JoinStepIndicatorProps) => {
  switch (props.status) {
    case "DONE": {
      return (
        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-green-500">
          <Check weight="bold" color="white" className="size-3" />
        </div>
      )
    }

    case "NO_ACCESS": {
      return (
        <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-gray">
          <X weight="bold" color="white" className="size-3" />
        </div>
      )
    }

    case "INACTIVE": {
      return (
        <div className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border-muted bg-card-secondary" />
      )
    }

    case "LOADING": {
      return (
        <div className="flex size-5 shrink-0 items-center justify-center">
          <CircleNotch
            weight="bold"
            className="size-5 animate-spin opacity-60 duration-500 [scale:1.1]"
          />
        </div>
      )
    }

    case "PROGRESS": {
      return (
        <CircularProgressBar
          progress={props.progress / 100}
          strokeWidth={15}
          color="hsl(var(--info))"
          className="size-5 shrink-0"
        />
      )
    }
  }
}

export { JoinStepIndicator }
