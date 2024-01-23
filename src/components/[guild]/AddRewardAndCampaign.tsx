import {
  ButtonGroup,
  Divider,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Portal,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import CreateCampaignModal from "components/[guild]/CreateCampaignModal"
import { CaretDown, Plus } from "phosphor-react"
import AddRewardButton from "./AddRewardButton"
import CreateFormModal from "./CreateFormModal"
import { useIsTabsStuck } from "./Tabs"
import { useThemeContext } from "./ThemeContext"
import useGuild from "./hooks/useGuild"

const AddRewardAndCampaign = () => {
  const { featureFlags } = useGuild()

  const {
    isOpen: isCreateCampaignModalOpen,
    onOpen: onCreateCampaignModalOpen,
    onClose: onCreateCampaignModalClose,
  } = useDisclosure()
  const {
    isOpen: isCreateFormModalOpen,
    onOpen: onCreateFormModalOpen,
    onClose: onCreateFormModalClose,
  } = useDisclosure()

  const { isStuck } = useIsTabsStuck()
  const { textColor, buttonColorScheme } = useThemeContext()

  return (
    <>
      <ButtonGroup isAttached>
        <AddRewardButton />
        <Divider orientation="vertical" h="8" />
        <Menu placement="bottom-end" autoSelect={false}>
          <MenuButton
            as={IconButton}
            icon={<CaretDown />}
            size="sm"
            variant="ghost"
            borderTopLeftRadius="0"
            borderBottomLeftRadius="0"
            {...(!isStuck && {
              color: textColor,
              colorScheme: buttonColorScheme,
            })}
          />
          <Portal>
            <MenuList
              maxW={{ base: "100vw", sm: "sm" }}
              py={0}
              zIndex="popover"
              overflow="hidden"
            >
              {featureFlags.includes("ROLE_GROUPS") && (
                <>
                  <MenuItem
                    onClick={onCreateCampaignModalOpen}
                    icon={<Icon as={Plus} mt="1" />}
                    alignItems="start"
                    py={4}
                  >
                    <Stack spacing={0.5}>
                      <Text as="span" fontWeight="semibold" fontSize="sm">
                        Create new page
                      </Text>
                      <Text colorScheme="gray" fontSize="sm">
                        Add a separate page with it’s own roles and rewards,
                        highlighted at the top of your guild for everyone
                      </Text>
                    </Stack>
                  </MenuItem>
                  <MenuDivider my={0} />
                </>
              )}

              <MenuItem
                onClick={onCreateFormModalOpen}
                icon={<Icon as={Plus} mt="1" />}
                alignItems="start"
                py={4}
              >
                <Stack spacing={0.5}>
                  <Text as="span" fontWeight="semibold" fontSize="sm">
                    Create form
                  </Text>
                  <Text colorScheme="gray" fontSize="sm">
                    Create a form which you can use either as requirement or reward
                  </Text>
                </Stack>
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </ButtonGroup>

      <CreateCampaignModal
        isOpen={isCreateCampaignModalOpen}
        onClose={onCreateCampaignModalClose}
      />
      <CreateFormModal
        isOpen={isCreateFormModalOpen}
        onClose={onCreateFormModalClose}
      />
    </>
  )
}

export default AddRewardAndCampaign
