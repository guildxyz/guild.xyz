import { ButtonGroup, ButtonProps, HStack, Text, Tooltip } from "@chakra-ui/react"
import Button from "components/common/Button"
import React, { PropsWithChildren } from "react"
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
  addonButton?: JSX.Element
} & Omit<ButtonProps, "isDisabled">

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

export default JoinStep
