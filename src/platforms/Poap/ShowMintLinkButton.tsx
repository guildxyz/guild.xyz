import {
  Box,
  ButtonProps,
  Center,
  HStack,
  Icon,
  Link as LinkButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import ErrorAlert from "components/common/ErrorAlert"
import { Modal } from "components/common/Modal"
import { ArrowSquareOut, CheckCircle } from "phosphor-react"
import useClaimText from "platforms/SecretText/hooks/useClaimText"
import { PropsWithChildren } from "react"
import { Rest } from "types"
import { useAccount } from "wagmi"

export type ShowMintLinkButtonProps = { rolePlatformId: number } & ButtonProps & Rest

export const ShowMintLinkButton: React.FC<
  PropsWithChildren<ShowMintLinkButtonProps>
> = ({ rolePlatformId, children, ...rest }) => {
  const { address } = useAccount()
  const {
    isLoading,
    error,
    response,
    modalProps: { isOpen, onOpen, onClose },
  } = useClaimText(rolePlatformId)
  const httpsLink = response?.uniqueValue?.replace("http://", "https://")

  return (
    <>
      <Button onClick={onOpen} {...rest}>
        {children}
      </Button>
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
                  as={CheckCircle}
                  color="green.500"
                  boxSize="16"
                  weight="light"
                />
                <Box pl="6" w="calc(100% - var(--chakra-sizes-16))">
                  <Text>You can mint your POAP on the link below:</Text>
                  <LinkButton
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
                    <Icon as={ArrowSquareOut} />
                  </LinkButton>
                </Box>
              </HStack>
            ) : (
              <ErrorAlert label={error?.error ?? "Something went wrong"} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
