import {
  ButtonGroup,
  ButtonProps,
  Circle,
  CircularProgress,
  HStack,
  Icon,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Check, X } from "phosphor-react"
import React, { PropsWithChildren } from "react"
import { getJoinStepIndicatorProps } from "../utils/getStepIndicatorProps"
import { JoinState } from "../utils/mapAccessJobState"

type Props = {
  title: string
  titleRightElement?: JSX.Element
  buttonLabel: string | JSX.Element
  isRequired?: boolean
  isDisabled?: string
  icon: JSX.Element
  colorScheme: string
  isDone: boolean
  addonButton?: JSX.Element
} & Omit<ButtonProps, "isDisabled">

const JoinStepIndicator = (
  props:
    | { status: "INACTIVE" | "DONE" | "ERROR" | "LOADING" }
    | { status: "PROGRESS"; progress: number }
) => {
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
          color={"white"}
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

const JoinStatusStep = ({
  joinState,
  entity,
}: {
  joinState: JoinState
  entity: "role" | "requirement" | "reward"
}) => {
  const props = getJoinStepIndicatorProps(entity, joinState)
  return <JoinStepIndicator {...props} />
}

const JoinStep = ({
  title,
  titleRightElement,
  buttonLabel,
  isRequired,
  icon,
  colorScheme,
  isDone,
  addonButton,
  children,
  ...buttonProps
}: PropsWithChildren<Props>) => {
  const ButtonWrapper = addonButton ? ButtonGroup : React.Fragment
  const buttonWrapperProps = addonButton ? { isAttached: true } : {}

  return (
    <HStack>
      <JoinStepIndicator status={isDone ? "DONE" : "INACTIVE"} />

      <HStack w="full">
        <Text fontWeight="bold" noOfLines={1}>
          {title}
          {isRequired && (
            <Text as="span" color="red.300">
              {` *`}
            </Text>
          )}
        </Text>
        {titleRightElement}
      </HStack>
      <ButtonWrapper {...buttonWrapperProps}>
        <Tooltip
          isDisabled={!buttonProps.isDisabled}
          label={buttonProps.isDisabled}
          shouldWrapChildren
        >
          <Button
            leftIcon={icon}
            colorScheme={colorScheme}
            flexShrink="0"
            minW="max-content"
            maxW={isDone && "40"}
            {...buttonProps}
            isDisabled={isDone || buttonProps.isDisabled}
            borderRightRadius={!!addonButton && 0}
          >
            {buttonLabel}
          </Button>
        </Tooltip>

        {addonButton}
      </ButtonWrapper>
      {children}
    </HStack>
  )
}

export { JoinStatusStep, JoinStepIndicator }
export default JoinStep
