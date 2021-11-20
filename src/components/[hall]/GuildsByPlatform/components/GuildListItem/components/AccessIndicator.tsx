import { Flex, Icon, Spinner, Stack, Text, useColorMode } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { Check, CheckCircle, X } from "phosphor-react"

type Props = {
  isMember: boolean
  hasAccess: boolean
  isLoading: boolean
  error: string
}

const AccessIndicator = ({
  isMember,
  hasAccess,
  isLoading,
  error,
}: Props): JSX.Element => {
  const { account } = useWeb3React()

  const { colorMode } = useColorMode()

  const colorScheme = () => {
    if (isMember) return "green"
    if (hasAccess) return "blue"
    return "gray"
  }

  return (
    <Stack
      direction={{ base: "row", md: "column" }}
      alignItems="center"
      justifyContent="start"
      position="relative"
      p={4}
      minWidth="max-content"
      height="max-content"
      _before={{
        content: "''",
        position: "absolute",
        inset: 0,
        rounded: "xl",
        bgColor: `${colorScheme()}.${colorMode === "light" ? "200" : "500"}`,
        opacity: 0.15,
      }}
    >
      {!account && (
        <>
          <Flex
            boxSize={6}
            alignItems="center"
            justifyContent="center"
            bgColor={`${colorScheme()}.${colorMode === "light" ? "200" : "500"}`}
            rounded="full"
          >
            <Icon boxSize={4} as={X} />
          </Flex>
          <Text
            color={`${colorScheme()}.${colorMode === "light" ? "200" : "500"}`}
            fontSize="sm"
          >
            Not connected
          </Text>
        </>
      )}
      {!error && (
        <>
          {isMember ? (
            <>
              <Flex
                boxSize={6}
                alignItems="center"
                justifyContent="center"
                bgColor={`${colorScheme()}.${colorMode === "light" ? "200" : "500"}`}
                rounded="full"
              >
                <Icon boxSize={4} as={CheckCircle} />
              </Flex>
              <Text
                color={`${colorScheme()}.${colorMode === "light" ? "200" : "500"}`}
                fontSize="sm"
              >
                You're in
              </Text>
            </>
          ) : isLoading ? (
            <>
              <Flex
                boxSize={6}
                alignItems="center"
                justifyContent="center"
                bgColor={`${colorScheme()}.${colorMode === "light" ? "200" : "500"}`}
                rounded="full"
              >
                <Icon boxSize={4} as={Spinner} />
              </Flex>
              <Text
                color={`${colorScheme()}.${colorMode === "light" ? "200" : "500"}`}
                fontSize="sm"
              >
                Checking access
              </Text>
            </>
          ) : hasAccess ? (
            <>
              <Flex
                boxSize={6}
                alignItems="center"
                justifyContent="center"
                bgColor={`${colorScheme()}.${colorMode === "light" ? "200" : "500"}`}
                rounded="full"
              >
                <Icon boxSize={4} as={Check} />
              </Flex>
              <Text
                color={`${colorScheme()}.${colorMode === "light" ? "200" : "500"}`}
                fontSize="sm"
              >
                You have access
              </Text>
            </>
          ) : (
            <>
              <Flex
                boxSize={6}
                alignItems="center"
                justifyContent="center"
                bgColor={`${colorScheme()}.${colorMode === "light" ? "200" : "500"}`}
                rounded="full"
              >
                <Icon boxSize={4} as={X} />
              </Flex>
              <Text
                color={`${colorScheme()}.${colorMode === "light" ? "200" : "500"}`}
                fontSize="sm"
              >
                No access
              </Text>
            </>
          )}
        </>
      )}
    </Stack>
  )
}

export default AccessIndicator
