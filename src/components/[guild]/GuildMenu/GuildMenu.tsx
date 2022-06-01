import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react"
import OnboardingMarker from "components/common/OnboardingMarker"
import { DotsThree } from "phosphor-react"
import CreatePoap from "../CreatePoap"
import EditGuild from "../EditGuild"
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

  return (
    <>
      <Menu>
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
          <MenuItem onClick={onEditGuildOpen}>Edit guild</MenuItem>
          <MenuItem onClick={onCreatePoapOpen}>Create a POAP</MenuItem>
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
