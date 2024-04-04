import { ButtonGroup, ButtonProps, HStack, Text, Tooltip } from "@chakra-ui/react"
import Button from "components/common/Button"
import React, { PropsWithChildren } from "react"
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
  addonButton?: JSX.Element
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
  addonButton,
  children,
  ...buttonProps
}: PropsWithChildren<JoinStepProps>) => {
  const ButtonWrapper = addonButton ? ButtonGroup : React.Fragment
  const buttonWrapperProps = addonButton ? { isAttached: true } : {}

  return (
    <JoinStepUI {...{ isDone, title, titleRightElement, isRequired }}>
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
    </JoinStepUI>
  )
}

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
