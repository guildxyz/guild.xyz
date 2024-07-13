import {
  accountModalAtom,
  walletSelectorModalAtom,
} from "@/components/Providers/atoms"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Spacer,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import { SignIn } from "@phosphor-icons/react/SignIn"
import Button from "components/common/Button"
import Card from "components/common/Card"
import { useSetAtom } from "jotai"
import useGuildPermission from "./hooks/useGuildPermission"
import useUser from "./hooks/useUser"

const NoPermissionToPageFallback = ({ children }) => {
  const { id, isLoading } = useUser()
  const { isAdmin } = useGuildPermission()
  const setIsWalletSelectorModalOpen = useSetAtom(walletSelectorModalAtom)
  const setIsAccountModalOpen = useSetAtom(accountModalAtom)

  if (isLoading)
    return (
      <Card py="7" px="4" flexDirection="row" alignItems="center">
        <Spinner mr="3" boxSize="5" />
        <Text fontWeight="semibold">Checking permission</Text>
      </Card>
    )

  if (!id)
    return (
      <Card>
        <Alert status="info" pb={5} alignItems={"center"}>
          <AlertIcon />
          <Stack>
            <AlertDescription
              position="relative"
              top={0.5}
              fontWeight="semibold"
              pr="4"
            >
              Sign in to access this page
            </AlertDescription>
          </Stack>
          <Spacer />
          <Button
            leftIcon={<SignIn />}
            colorScheme="white"
            onClick={() => setIsWalletSelectorModalOpen(true)}
          >
            Sign in
          </Button>
        </Alert>
      </Card>
    )

  if (!isAdmin)
    return (
      <Card>
        <Alert status="error" pb={5} alignItems={"center"}>
          <AlertIcon />
          <Stack>
            <AlertDescription position="relative" top={0.5} fontWeight="semibold">
              You don't have permission to view this page
            </AlertDescription>
          </Stack>
          <Spacer />
          <Button colorScheme="white" onClick={() => setIsAccountModalOpen(true)}>
            View account
          </Button>
        </Alert>
      </Card>
    )

  return children
}

export default NoPermissionToPageFallback
