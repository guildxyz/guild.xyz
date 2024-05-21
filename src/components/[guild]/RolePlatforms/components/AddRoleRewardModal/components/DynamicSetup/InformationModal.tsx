import {
  Box,
  Checkbox,
  Flex,
  HStack,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import { targetRoleAtom } from "components/[guild]/RoleCard/components/EditRole/EditRole"
import Button from "components/common/Button"
import { useAtomValue } from "jotai"
import Image from "next/image"
import { ArrowLeft } from "phosphor-react"
import { useState } from "react"
import BaseValueModal from "./BaseValueModal"

export const DONT_SHOW_DYNAMIC_INFO_KEY = "dontShowDynamicRewardInfoModal"

const InformationModal = () => {
  const { setStep } = useAddRewardContext()
  const footerBg = useColorModeValue("blackAlpha.100", "blackAlpha.700")

  const [checked, setChecked] = useState(false)

  const handleDontShow = () => {
    localStorage.setItem(DONT_SHOW_DYNAMIC_INFO_KEY, (!checked).toString())
    setChecked(!checked)
  }

  const targetRoleId = useAtomValue(targetRoleAtom)

  const {
    isOpen: baseValueModalIsOpen,
    onOpen: baseValueModalOnOpen,
    onClose: baseValueModalOnClose,
  } = useDisclosure()

  const handleBaseValueSelection = () => {
    baseValueModalOnClose()
    setStep("CONVERSION_SETUP")
  }

  return (
    <>
      <ModalContent maxW={"2xl"}>
        <ModalCloseButton />
        <ModalHeader>
          <HStack>
            <IconButton
              rounded="full"
              aria-label="Back"
              size="sm"
              mb="-3px"
              icon={<ArrowLeft size={20} />}
              variant="ghost"
              onClick={() => {
                setStep("REWARD_SETUP")
              }}
            />
            <Text>About dynamic rewards</Text>
          </HStack>
        </ModalHeader>
        <ModalBody className="custom-scrollbar" display="flex" flexDir="column">
          <Stack gap={5}>
            <Text fontWeight={"semibold"} color={"GrayText"}>
              Dynamic rewards utilize a <em>requirement</em> to provide the base
              value for calculating the reward amount. This base value can then be
              converted into the actual reward amount by setting a conversion rate.
            </Text>

            <Box
              bg={"blackAlpha.400"}
              px={6}
              py={8}
              position={"relative"}
              w="full"
              rounded={"xl"}
              mt={5}
            >
              <Image
                priority
                layout="responsive"
                width={610}
                height={166}
                src={"/img/dynamic_illustration.svg"}
                alt="Illustration for dynamic rewards"
              />
            </Box>

            <Flex justifyContent={"flex-end"} mt="auto" pt="5">
              <Button colorScheme="green" onClick={baseValueModalOnOpen}>
                Select base value
              </Button>
            </Flex>
          </Stack>
        </ModalBody>
        <ModalFooter pt={6} bg={footerBg} border={"none"}>
          <HStack
            w="full"
            justifyContent={"left"}
            pt={{ base: 4, md: 5 }}
            spacing={3}
          >
            <Checkbox isChecked={checked}>
              <Text fontWeight="medium" colorScheme="gray" onClick={handleDontShow}>
                Don't show this again
              </Text>
            </Checkbox>
          </HStack>
        </ModalFooter>
      </ModalContent>

      <BaseValueModal
        roleId={targetRoleId as number}
        isOpen={baseValueModalIsOpen}
        onClose={baseValueModalOnClose}
        onSelect={handleBaseValueSelection}
      />
    </>
  )
}

export default InformationModal
