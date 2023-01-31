import {
  Box,
  Center,
  Divider,
  Flex,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Link from "components/common/Link"
import { Modal } from "components/common/Modal"
import { ArrowSquareOut, CheckCircle, XCircle } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import { useGuildCheckoutContext } from "../GuildCheckoutContex"
import PurchasedRequirementInfo from "./components/PurchasedRequirementInfo"

const InfoModal = (): JSX.Element => {
  const {
    isInfoModalOpen,
    onInfoModalClose,
    processing,
    success,
    txError,
    setProcessing,
    setSuccess,
    setTxError,
  } = useGuildCheckoutContext()

  const modalTitle = processing
    ? "Transaction is processing..."
    : success
    ? "Purchase successful"
    : txError
    ? "Transaction failed"
    : "Buy requirement"

  return (
    <Modal isOpen={isInfoModalOpen} onClose={onInfoModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalTitle}</ModalHeader>

        <ModalBody pb={txError ? 0 : undefined}>
          <Flex direction="column">
            <Center mb={10}>
              {processing ? (
                <Box p={4}>
                  <Spinner
                    thickness="10px"
                    speed="0.8s"
                    color="blue.500"
                    size="2xl"
                  />
                </Box>
              ) : success ? (
                <Icon
                  as={CheckCircle}
                  boxSize={36}
                  color="green.500"
                  sx={{
                    "> *": {
                      strokeWidth: "8px",
                    },
                  }}
                />
              ) : (
                <Icon
                  as={XCircle}
                  boxSize={36}
                  color="red.500"
                  sx={{
                    "> *": {
                      strokeWidth: "8px",
                    },
                  }}
                />
              )}
            </Center>

            <Text mb={4}>
              {processing ? (
                "The blockchain is working its magic... Your transaction should be confirmed shortly"
              ) : success ? (
                "Requirement successfully purchased! Your access is being rechecked"
              ) : (
                <>
                  {
                    "Couldn't purchase the assets. Learn about possible reasons here: "
                  }
                  <Link href="" colorScheme="blue">
                    todo
                  </Link>
                </>
              )}
            </Text>

            {(processing || success) && (
              <Text mb={6} colorScheme="gray">
                {"Transaction id: "}
                <Link isExternal href="" fontWeight="semibold">
                  {`${shortenHex("0x00000000", 3)} `}
                  <Icon ml={1} as={ArrowSquareOut} />
                </Link>
              </Text>
            )}

            {(processing || success) && <Divider mb={6} />}

            <Stack spacing={4}>
              {(processing || success) && (
                <>
                  <Text as="span" fontWeight="bold">
                    {processing ? "You'll get:" : "Your new assets:"}
                  </Text>

                  <PurchasedRequirementInfo />
                </>
              )}
            </Stack>
          </Flex>
        </ModalBody>

        {/* {(success || txError) && ( */}
        {true && (
          <ModalFooter>
            <Button
              size="xl"
              colorScheme="blue"
              w="full"
              onClick={
                processing
                  ? () => {
                      setSuccess(true)
                      setProcessing(false)
                    }
                  : success
                  ? () => {
                      setTxError(true)
                      setSuccess(false)
                    }
                  : onInfoModalClose
              }
            >
              Close
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
}

export default InfoModal
