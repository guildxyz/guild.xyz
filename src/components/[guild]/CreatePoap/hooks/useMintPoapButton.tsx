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
  useDisclosure,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import useClaimPoap from "components/[guild]/claim-poap/hooks/useClaimPoap"
import ErrorAlert from "components/common/ErrorAlert"
import { Modal } from "components/common/Modal"
import { ArrowSquareOut, CheckCircle } from "phosphor-react"

const useMintPoapButton = (poapId: number) => {
  const { account } = useWeb3React()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { onSubmit, response, ...rest } = useClaimPoap(poapId)

  const buttonProps = response
    ? { as: "a", target: "_blank", href: `${response}?address=${account}` }
    : {
        onClick: () => {
          onSubmit()
          onOpen()
        },
      }

  return {
    buttonProps,
    modalProps: {
      isOpen,
      onClose,
      response,
      ...rest,
    },
  }
}

const MintModal = ({ isOpen, onClose, isLoading, response, error }) => {
  const { account } = useWeb3React()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Mint POAP</ModalHeader>
        <ModalBody>
          {isLoading ? (
            <HStack spacing="6">
              <Center boxSize="16">
                <Spinner />
              </Center>
              <Text>Getting your minting link...</Text>
            </HStack>
          ) : response ? (
            <HStack spacing={0}>
              <Icon as={CheckCircle} color="green.500" boxSize="16" weight="light" />
              <Box pl="6" w="calc(100% - var(--chakra-sizes-16))">
                <Text>{`You can mint your POAP on the link below:`}</Text>
                <Link
                  mt={2}
                  maxW="full"
                  href={`${response}?address=${account}`}
                  colorScheme="blue"
                  isExternal
                  fontWeight="semibold"
                >
                  <Text as="span" noOfLines={1}>
                    {response}
                  </Text>
                  <Icon as={ArrowSquareOut} />
                </Link>
              </Box>
            </HStack>
          ) : (
            <ErrorAlert label={error} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export { MintModal }
export default useMintPoapButton
