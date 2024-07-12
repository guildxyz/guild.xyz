import {
  Circle,
  CircularProgress,
  Icon,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react"
import { Check, X } from "phosphor-react"

export type JoinStepIndicatorProps =
  | { status: "INACTIVE" | "DONE" | "NO_ACCESS" | "LOADING" }
  | { status: "PROGRESS"; progress: number }

const JoinStepIndicator = (props: JoinStepIndicatorProps) => {
  const color = useColorModeValue("black", "white")

  switch (props.status) {
    case "DONE": {
      return (
        <Circle size="5" bg="green.500">
          <Icon weight="bold" color="white" as={Check} boxSize="0.8em" />
        </Circle>
      )
    }

    case "NO_ACCESS": {
      return (
        <Circle size="5" bg="gray.500">
          <Icon weight="bold" color="white" as={X} boxSize="0.7em" />
        </Circle>
      )
    }

    case "INACTIVE": {
      return (
        <Circle
          size="5"
          bg="blackAlpha.100"
          borderWidth={"1px"}
          borderColor="whiteAlpha.100"
        />
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
