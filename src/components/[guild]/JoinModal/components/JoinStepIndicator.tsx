import {
  Circle,
  CircularProgress,
  Icon,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react"
import { Check, X } from "phosphor-react"

export type JoinStepIndicatorProps =
  | { status: "INACTIVE" | "DONE" | "ERROR" | "LOADING" }
  | { status: "PROGRESS"; progress: number }

const JoinStepIndicator = (props: JoinStepIndicatorProps) => {
  const color = useColorModeValue("black", "white")

  switch (props.status) {
    case "DONE":
    case "ERROR":
    case "INACTIVE": {
      return (
        <Circle
          size="5"
          border={"1px"}
          {...(props.status === "DONE"
            ? {
                bg: "green.500",
                borderColor: "green.500",
              }
            : props.status === "ERROR"
            ? { bg: "gray.500", borderColor: "gray.500" }
            : { bg: "blackAlpha.100", borderColor: "whiteAlpha.100" })}
        >
          {(props.status === "DONE" || props.status === "ERROR") && (
            <Icon
              as={props.status === "ERROR" ? Check : X}
              weight="bold"
              color={"white"}
              boxSize={"0.8em"}
              {...(props.status === "DONE"
                ? { as: Check, boxSize: "0.8em" }
                : { as: X, boxSize: "0.7em" })}
            />
          )}
        </Circle>
      )
    }

    case "LOADING": {
      return (
        <Circle border={"1px transparent"}>
          <Spinner boxSize="5" opacity=".6" />
        </Circle>
      )
    }

    case "PROGRESS": {
      return (
        <CircularProgress
          value={props.progress}
          size="5"
          color={color}
          sx={{
            "> svg > .chakra-progress__track": {
              stroke: "var(--chakra-colors-blackAlpha-200)",
            },
          }}
        />
      )
    }
  }
}

export default JoinStepIndicator
