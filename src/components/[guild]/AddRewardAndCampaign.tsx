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
import { CaretDown } from "@phosphor-icons/react/CaretDown"
import { Plus } from "@phosphor-icons/react/Plus"
import CreateCampaignModal from "components/[guild]/CreateCampaignModal"
import AddSolutionsButton from "solutions/components/AddSolutionsButton"
import { useIsTabsStuck } from "./Tabs"
import { useThemeContext } from "./ThemeContext"

const AddRewardAndCampaign = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isStuck } = useIsTabsStuck()
  const { textColor = null, buttonColorScheme = null } = useThemeContext() || {}

  return (
    <>
      <ButtonGroup isAttached>
        <AddSolutionsButton />
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
    </>
  )
}

export default AddRewardAndCampaign
