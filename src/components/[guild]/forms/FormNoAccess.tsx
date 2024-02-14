import { HStack, Icon, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import useWeb3ConnectionManager from "components/_app/Web3ConnectionManager/hooks/useWeb3ConnectionManager"
import Button from "components/common/Button"
import Card from "components/common/Card"
import ClientOnly from "components/common/ClientOnly"
import { Lock, LockSimple, Wallet } from "phosphor-react"

const FormNoAccess = ({ children }) => {
  const { isWeb3Connected, openWalletSelectorModal } = useWeb3ConnectionManager()

  const { triggerMembershipUpdate, isLoading } = useMembershipUpdate()

  const bgColor = useColorModeValue("gray.50", "blackAlpha.300")

  return (
    <Card>
      <Stack bgColor={bgColor}>
        <Stack justifyContent="space-between" p={5}>
          <HStack>
            <Icon as={Lock} />
            <Text fontWeight="semibold">
              This form is locked. Requirements to access:
            </Text>
          </HStack>

          <ClientOnly>
            <Button
              leftIcon={
                <Icon
                  as={isWeb3Connected ? LockSimple : Wallet}
                  width={"0.9em"}
                  height="0.9em"
                />
              }
              size="sm"
              borderRadius="lg"
              isLoading={isLoading}
              loadingText="Checking access"
              onClick={
                isWeb3Connected
                  ? () => triggerMembershipUpdate()
                  : () => openWalletSelectorModal()
              }
            >
              {isWeb3Connected ? "Join Guild to check access" : "Connect to access"}
            </Button>
          </ClientOnly>
        </Stack>

        {children}
      </Stack>
    </Card>
  )
}

export default FormNoAccess
