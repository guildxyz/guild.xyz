import {
  Box,
  Divider,
  HStack,
  Icon,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import ClientOnly from "components/common/ClientOnly"
import { Lock } from "phosphor-react"
import { PropsWithChildren } from "react"
import { useOpenJoinModal } from "../JoinModal/JoinModalProvider"
import RecheckAccessesButton from "../RecheckAccessesButton"

const FormNoAccess = ({
  isMember,
  children,
}: PropsWithChildren<{
  isMember: boolean
}>) => {
  const openJoinModal = useOpenJoinModal()

  const bgColor = useColorModeValue("gray.50", "blackAlpha.300")
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Card>
      <HStack justifyContent="space-between" p={5} bgColor={bgColor}>
        <HStack>
          <Icon as={Lock} />
          <Text fontWeight="semibold">
            {`This form is locked${
              isMember || !isMobile ? ". Requirements to access:" : ""
            }`}
          </Text>
        </HStack>

        <ClientOnly>
          {isMember ? (
            <RecheckAccessesButton size="sm" />
          ) : (
            <Button
              size="sm"
              colorScheme="green"
              borderRadius="lg"
              loadingText="Checking access"
              onClick={openJoinModal}
            >
              Join to check access
            </Button>
          )}
        </ClientOnly>
      </HStack>
      <Divider />
      <Box pt="5">{children}</Box>
    </Card>
  )
}

export default FormNoAccess
