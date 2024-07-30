import { usePostHogContext } from "@/components/Providers/PostHogProvider"
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import Button from "components/common/Button"
import { Modal } from "components/common/Modal"
import { useMintGuildPinContext } from "../../MintGuildPinContext"
import AlphaTag from "../../components/AlphaTag"
import GuildPinImage from "../../components/GuildPinImage"
import { GUILD_PIN_MAINTENANCE } from "../constants"
import FuelGuildPinFees from "./FuelGuildPinFees"
import MintFuelGuildPinButton from "./MintFuelGuildPinButton"

const MintFuelGuildPin = () => {
  const { captureEvent } = usePostHogContext()
  const { urlName } = useGuild()

  const { isOpen, onOpen, onClose } = useMintGuildPinContext()

  const { colorMode } = useColorMode()

  return (
    <>
      <Tooltip
        isDisabled={!GUILD_PIN_MAINTENANCE}
        label="Under maintenance, please check back later!"
        hasArrow
      >
        <Button
          isDisabled={GUILD_PIN_MAINTENANCE}
          onClick={
            GUILD_PIN_MAINTENANCE
              ? undefined
              : () => {
                  onOpen()
                  captureEvent("Click: Mint Fuel Guild Pin (GuildPinRewardCard)", {
                    guild: urlName,
                  })
                }
          }
          variant="outline"
          borderColor={colorMode === "dark" ? "whiteAlpha.200" : "blackAlpha.200"}
          {...(colorMode === "light"
            ? {
                _hover: {
                  bg: "blackAlpha.50",
                },
                _active: {
                  bg: "blackAlpha.200",
                },
              }
            : {})}
        >
          Mint Guild Pin
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} colorScheme="dark">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={4} pr={16}>
            <Text as="span" mr={2}>
              Mint Guild Pin
            </Text>
            <AlphaTag />
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb="6">
            <GuildPinImage />
          </ModalBody>

          <ModalFooter flexDir="column">
            <Stack w="full" spacing={6}>
              <FuelGuildPinFees />

              <Stack w="full" spacing={2}>
                <MintFuelGuildPinButton />
              </Stack>

              <Text colorScheme="gray" fontSize="sm">
                This is a non-transferable token that has no financial value.
              </Text>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default MintFuelGuildPin
