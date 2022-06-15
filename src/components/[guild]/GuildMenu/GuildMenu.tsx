import {
  Icon,
  IconButton,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react"
import OnboardingMarker from "components/common/OnboardingMarker"
import { DotsThree, GearSix } from "phosphor-react"
import { PlatformNames } from "types"
import CreatePoap from "../CreatePoap"
import EditGuild from "../EditGuild"
import useGuild from "../hooks/useGuild"
import { useOnboardingContext } from "../Onboarding/components/OnboardingProvider"

const GuildMenu = (): JSX.Element => {
  const {
    isOpen: isEditGuildOpen,
    onOpen: onEditGuildOpen,
    onClose: onEditGuildClose,
  } = useDisclosure()

  const {
    isOpen: isCreatePoapOpen,
    onOpen: onCreatePoapOpen,
    onClose: onCreatePoapClose,
  } = useDisclosure()

  const { localStep } = useOnboardingContext()

  const { guildPlatforms } = useGuild()

  return (
    <>
      <Menu placement="bottom-end">
        <OnboardingMarker step={1}>
          <MenuButton
            as={IconButton}
            icon={<DotsThree />}
            aria-label="Menu"
            minW={"44px"}
            rounded="full"
            colorScheme="alpha"
            data-dd-action-name={
              localStep === null ? "Edit guild" : "Edit guild [onboarding]"
            }
          />
        </OnboardingMarker>

        <MenuList>
          <MenuItem icon={<Icon as={GearSix} />} onClick={onEditGuildOpen}>
            Edit guild
          </MenuItem>
          {guildPlatforms?.some((p) => p.platformId === PlatformNames.DISCORD) && (
            <MenuItem
              icon={
                <Img
                  boxSize={3}
                  src="/requirementLogos/poap.svg"
                  alt="Drop POAP icon"
                />
              }
              onClick={onCreatePoapOpen}
            >
              Drop POAP
            </MenuItem>
          )}
        </MenuList>
      </Menu>

      <EditGuild
        {...{
          isOpen: isEditGuildOpen,
          onOpen: onEditGuildOpen,
          onClose: onEditGuildClose,
        }}
      />

      <CreatePoap
        {...{
          isOpen: isCreatePoapOpen,
          onOpen: onCreatePoapOpen,
          onClose: onCreatePoapClose,
        }}
      />
    </>
  )
}

export default GuildMenu
