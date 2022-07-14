import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import useKeyPair from "hooks/useKeyPair"

const BUTTON_TEXT = "Remember my wallet"

const KeyPairModal = ({ children }) => {
  const { keyPair, ready, set } = useKeyPair()

  return (
    <>
      {children}
      <Modal
        isOpen={ready && !keyPair}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={() => {}}
      >
        <ModalOverlay />
        <ModalContent minW="xl">
          <ModalHeader>Remember wallet</ModalHeader>
          <ModalBody>
            <Text>
              When clicking{" "}
              <Text as="span" fontStyle={"italic"}>
                {BUTTON_TEXT}
              </Text>
              , you will be requested a signature, which is needed to assign you a
              unique signing key pair. With this key pair, you only have to sign once
              now, not every time you interact with Guild.
            </Text>

            {/* <Alert status="info" mt={5}>
              <AlertIcon />
              The key pair can only be used to sign Guild interactions, so any funds
              on your wallet are safe, and it is stored safely in your browser, so no
              one can export your private key.
            </Alert> */}

            <Accordion
              mt={5}
              allowToggle
              backgroundColor={"whiteAlpha.100"}
              borderRadius="md"
            >
              <AccordionItem border={"none"}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Is this safe?
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  The generated key pair can only be used in this browser, and only
                  for signing messages. It's not possible to export the private key.
                  The keys can only be used for Guild interactions, any funds on your
                  wallet are safe.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <HStack justifyContent={"end"} mt={5}>
              <Button
                colorScheme={"green"}
                onClick={set.onSubmit}
                isLoading={set.isLoading}
                loadingText="Generating keypair"
              >
                {BUTTON_TEXT}
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default KeyPairModal
