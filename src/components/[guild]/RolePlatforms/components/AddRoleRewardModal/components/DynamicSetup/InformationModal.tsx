import {
  Box,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { Modal } from "components/common/Modal"
import Image from "next/image"

const InformationModal = ({ isOpen, onClose }) => {
  const figureBg = useColorModeValue("blackAlpha.100", "blackAlpha.400")
  const imageUrl = useColorModeValue(
    "/img/dynamic_illustration_light.webp",
    "/img/dynamic_illustration.webp"
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={"2xl"}>
        <ModalCloseButton />
        <ModalHeader pb="4">About dynamic rewards</ModalHeader>
        <ModalBody className="custom-scrollbar" display="flex" flexDir="column">
          <Stack gap={5}>
            <Text fontWeight={"semibold"} colorScheme={"gray"}>
              Dynamic rewards utilize a <em>requirement</em> to provide the base
              value for calculating the reward amount. This base value can then be
              converted into the actual reward amount by setting a conversion rate.
            </Text>

            <Box
              bg={figureBg}
              px={6}
              py={8}
              position={"relative"}
              w="full"
              rounded={"xl"}
              mt={5}
            >
              <Image
                priority
                quality={100}
                layout="responsive"
                width={610}
                height={166}
                src={imageUrl}
                alt="Illustration for dynamic rewards"
              />
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default InformationModal
