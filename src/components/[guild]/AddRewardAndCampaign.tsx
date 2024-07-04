import {
  ButtonGroup,
  Divider,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { CaretDown, Plus } from "@phosphor-icons/react"
import CreateCampaignModal from "components/[guild]/CreateCampaignModal"
import LiquidityIncentiveSetupModal from "solutions/LiquidityIncentive/LiquidityIncentiveSetupModal"
import AddRewardButton from "./AddRewardButton"
import { useIsTabsStuck } from "./Tabs"
import { useThemeContext } from "./ThemeContext"

const AddRewardAndCampaign = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isStuck } = useIsTabsStuck()
  const { textColor = null, buttonColorScheme = null } = useThemeContext() || {}

  const {
    isOpen: isSolutionOpen,
    onClose: onSolutionClose,
    onOpen: onSolutionOpen,
  } = useDisclosure()

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
              ...(textColor && { color: textColor }),
              ...(buttonColorScheme && { colorScheme: buttonColorScheme }),
            })}
          />
          <Portal>
            <MenuList
              maxW={{ base: "100vw", sm: "sm" }}
              py={0}
              zIndex="popover"
              overflow="hidden"
            >
              <MenuItem
                onClick={onSolutionOpen}
                icon={<Icon as={Plus} mt="1" />}
                alignItems="start"
                py={4}
              >
                <Text as="span" fontWeight="semibold" fontSize="sm">
                  Add solution
                </Text>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={onOpen}
                icon={<Icon as={Plus} mt="1" />}
                alignItems="start"
                py={4}
              >
                <Stack spacing={0.5}>
                  <Text as="span" fontWeight="semibold" fontSize="sm">
                    Create new page
                  </Text>
                  <Text colorScheme="gray" fontSize="sm">
                    Add a separate page with it’s own roles and rewards, highlighted
                    at the top of your guild for everyone
                  </Text>
                </Stack>
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </ButtonGroup>
      <CreateCampaignModal isOpen={isOpen} onClose={onClose} />
      <LiquidityIncentiveSetupModal
        isOpen={isSolutionOpen}
        onClose={onSolutionClose}
      />
    </>
  )
}

export default AddRewardAndCampaign
