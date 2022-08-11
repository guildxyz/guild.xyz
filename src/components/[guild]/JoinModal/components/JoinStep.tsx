import { ButtonProps, Circle, HStack, Icon, Text, Tooltip } from "@chakra-ui/react"
import Button from "components/common/Button"
import { Check } from "phosphor-react"
import { PropsWithChildren } from "react"

type Props = {
  title: string
  buttonLabel: string | JSX.Element
  isRequired?: boolean
  isDisabled?: string
  icon: JSX.Element
  colorScheme: string
  isDone: boolean
} & Omit<ButtonProps, "isDisabled">

const JoinStep = ({
  title,
  buttonLabel,
  isRequired,
  icon,
  colorScheme,
  isDone,
  children,
  ...buttonProps
}: PropsWithChildren<Props>) => (
  <HStack>
    <Circle
      size="5"
      border="1px"
      {...(isDone
        ? {
            bg: "green.500",
            borderColor: "green.500",
          }
        : { borderColor: "currentColor" })}
    >
      {isDone && <Icon as={Check} weight="bold" color={"white"} />}
    </Circle>
    <Text w="full" fontWeight={"bold"} isTruncated>
      {title}
      {isRequired && (
        <Text as="span" color={"red.300"}>
          {` *`}
        </Text>
      )}
    </Text>
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
      >
        {buttonLabel}
      </Button>
    </Tooltip>
    {children}
  </HStack>
)

export default JoinStep
