import {
  ButtonGroup,
  ButtonProps,
  Circle,
  HStack,
  Icon,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import { Check } from "phosphor-react"
import React, { PropsWithChildren } from "react"

type Props = {
  title: string
  buttonLabel: string | JSX.Element
  isRequired?: boolean
  isDisabled?: string
  icon: JSX.Element
  colorScheme: string
  isDone: boolean
  addonButton?: JSX.Element
  datadogActionName?: string
} & Omit<ButtonProps, "isDisabled">

const JoinStep = ({
  title,
  buttonLabel,
  isRequired,
  icon,
  colorScheme,
  isDone,
  addonButton,
  datadogActionName,
  children,
  ...buttonProps
}: PropsWithChildren<Props>) => {
  const ButtonWrapper = addonButton ? ButtonGroup : React.Fragment
  const buttonWrapperProps = addonButton ? { isAttached: true } : {}

  return (
    <HStack>
      <Circle
        size="5"
        border={"1px"}
        {...(isDone
          ? {
              bg: "green.500",
              borderColor: "green.500",
            }
          : { bg: "blackAlpha.100", borderColor: "whiteAlpha.100" })}
      >
        {isDone && <Icon as={Check} weight="bold" color={"white"} />}
      </Circle>
      <Text w="full" fontWeight={"bold"} noOfLines={1}>
        {title}
        {isRequired && (
          <Text as="span" color={"red.300"}>
            {` *`}
          </Text>
        )}
      </Text>
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
            maxW={isDone && "40"}
            {...buttonProps}
            isDisabled={isDone || buttonProps.isDisabled}
            borderRightRadius={!!addonButton && 0}
            data-dd-action-name={datadogActionName}
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
