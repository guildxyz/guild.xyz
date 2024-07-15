import {
  Box,
  Center,
  HStack,
  Icon,
  Link,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react"
import { PiArrowSquareOut } from "react-icons/pi"
import { PiCheckCircle } from "react-icons/pi"
import { useAccount } from "wagmi"
import ErrorAlert from "../../../common/ErrorAlert"
import { Modal } from "../../../common/Modal"

export const MintLinkModal = ({ isOpen, onClose, isLoading, error, response }) => {
  const httpsLink = response?.uniqueValue?.replace("http://", "https://")
  const { address } = useAccount()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />

        <ModalHeader pb={0}>{"Your mint link"}</ModalHeader>

        <ModalBody pt={8}>
          {isLoading ? (
            <HStack spacing="6">
              <Center boxSize="16">
                <Spinner />
              </Center>
              <Text>Getting your mint link...</Text>
            </HStack>
          ) : httpsLink ? (
            <HStack spacing={0}>
              <Icon
                as={PiCheckCircle}
                color="green.500"
                boxSize="16"
                weight="light"
              />
              <Box pl="6" w="calc(100% - var(--chakra-sizes-16))">
                <Text>You can mint your POAP on the link below:</Text>
                <Link
                  mt={2}
                  maxW="full"
                  href={`${httpsLink}?address=${address}`}
                  colorScheme="blue"
                  isExternal
                  fontWeight="semibold"
                >
                  <Text as="span" noOfLines={1}>
                    {httpsLink}
                  </Text>
                  <Icon as={PiArrowSquareOut} />
                </Link>
              </Box>
            </HStack>
          ) : (
            <ErrorAlert label={error?.error ?? "Something went wrong"} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
