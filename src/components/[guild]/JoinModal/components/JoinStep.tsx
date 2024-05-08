import { ButtonProps, HStack, Text, Tooltip } from "@chakra-ui/react"
import Button from "components/common/Button"
import { PropsWithChildren } from "react"
import JoinStepIndicator from "./JoinStepIndicator"

type JoinStepUIProps = {
  title: string
  titleRightElement?: JSX.Element
  isRequired?: boolean
  isDone: boolean
}

type JoinStepProps = {
  buttonLabel: string | JSX.Element
  isDisabled?: string
  icon: JSX.Element
  colorScheme: string
} & JoinStepUIProps &
  Omit<ButtonProps, "isDisabled">

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
}: PropsWithChildren<JoinStepProps>) => (
  <JoinStepUI {...{ isDone, title, titleRightElement, isRequired }}>
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
  </JoinStepUI>
)

export const JoinStepUI = ({
  isDone,
  title,
  isRequired,
  titleRightElement,
  children,
}: PropsWithChildren<JoinStepUIProps>) => (
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
    {children}
  </HStack>
)

export default JoinStep
