import { ButtonProps, Circle, HStack, Icon, Text } from "@chakra-ui/react"
import Button from "components/common/Button"
import { Check } from "phosphor-react"
import { PropsWithChildren } from "react"

type Props = {
  account: string
  isRequired?: boolean
  icon: JSX.Element
  colorScheme: string
  isConnected: string
} & ButtonProps

const ConnectAccount = ({
  account,
  isRequired,
  icon,
  colorScheme,
  isConnected,
  children,
  ...buttonProps
}: PropsWithChildren<Props>) => (
  <HStack>
    <Circle
      size="5"
      border="1px"
      {...(isConnected
        ? {
            bg: "green.500",
            borderColor: "green.500",
          }
        : { borderColor: "currentColor" })}
    >
      {isConnected && <Icon as={Check} weight="bold" color={"white"} />}
    </Circle>
    <Text w="full" fontWeight={"bold"} isTruncated>
      {isConnected ? `${account} connected` : `Connect ${account}`}
      {isRequired && (
        <Text as="span" color={"red.300"}>
          {` *`}
        </Text>
      )}
    </Text>
    <Button
      leftIcon={icon}
      colorScheme={colorScheme}
      flexShrink="0"
      isDisabled={isConnected}
      maxW={isConnected && "40"}
      {...buttonProps}
    >
      {isConnected ? isConnected : "Connect"}
    </Button>
    {children}
  </HStack>
)

export default ConnectAccount
