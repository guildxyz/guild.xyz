import { Button, ButtonProps } from "@/components/ui/Button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip"
import { cn } from "@/lib/utils"
import { PropsWithChildren, ReactNode } from "react"
import { JoinStepIndicator } from "./JoinStepIndicator"

type JoinStepUIProps = {
  title: string
  titleRightElement?: ReactNode
  isRequired?: boolean
  isDone: boolean
}

type JoinStepProps = {
  disabledText?: string
  buttonProps: ButtonProps
} & JoinStepUIProps

const JoinStep = ({
  title,
  titleRightElement,
  isRequired,
  isDone,
  disabledText,
  buttonProps,
  children,
}: PropsWithChildren<JoinStepProps>) => (
  <JoinStepUI {...{ isDone, title, titleRightElement, isRequired }}>
    <Tooltip open={buttonProps.disabled ? undefined : false}>
      <TooltipTrigger className="cursor-default">
        <Button
          {...buttonProps}
          disabled={isDone || buttonProps.disabled}
          className={cn(
            "max-w-max shrink-0",
            {
              "max-w-40": isDone,
            },
            buttonProps.className
          )}
        >
          {buttonProps.children}
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        <span>{disabledText}</span>
      </TooltipContent>
    </Tooltip>

    {children}
  </JoinStepUI>
)

const JoinStepUI = ({
  isDone,
  title,
  isRequired,
  titleRightElement,
  children,
}: PropsWithChildren<JoinStepUIProps>) => (
  <div className="flex w-full items-center justify-between gap-2">
    <div className="flex items-center gap-2">
      <JoinStepIndicator status={isDone ? "DONE" : "INACTIVE"} />
      <span className="text-ellipsis font-bold">
        {title}
        {isRequired && <span className="text-destructive">{` *`}</span>}
      </span>
      {titleRightElement}
    </div>

    {children}
  </div>
)

export { JoinStep, JoinStepUI }
