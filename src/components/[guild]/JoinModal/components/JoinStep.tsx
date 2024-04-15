import { ButtonProps, HStack, Text, Tooltip } from "@chakra-ui/react"
import Button from "components/common/Button"
import { PropsWithChildren } from "react"
import JoinStepIndicator from "./JoinStepIndicator"

type Props = {
  title: string
  titleRightElement?: JSX.Element
  buttonLabel: string | JSX.Element
  isRequired?: boolean
  isDisabled?: string
  icon: JSX.Element
  colorScheme: string
  isDone: boolean
} & Omit<ButtonProps, "isDisabled">

const JoinStep = ({
  title,
  titleRightElement,
  buttonLabel,
  isRequired,
  icon,
  colorScheme,
  isDone,
  children,
  ...buttonProps
}: PropsWithChildren<Props>) => (
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
      >
        {buttonLabel}
      </Button>
    </Tooltip>

    {children}
  </HStack>
)

export default JoinStep
