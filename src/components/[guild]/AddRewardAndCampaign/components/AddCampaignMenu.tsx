import {
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
import CreateCampaignModal from "components/[guild]/CreateCampaignModal"
import { CampaignFormType } from "components/[guild]/CreateCampaignModal/components/CampaignForm"
import { CaretDown, Plus } from "phosphor-react"
import { useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"

const AddCampaignMenu = () => {
  const addCampaignButtonRef = useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const methods = useForm<CampaignFormType>({ mode: "all" })

  return (
    <>
      <Menu placement="bottom-end">
        <MenuButton
          as={IconButton}
          icon={<CaretDown />}
          borderTopLeftRadius="0"
          borderBottomLeftRadius="0"
        />
        <Portal>
          <MenuList maxW="sm" py={0} zIndex="popover">
            <MenuItem
              ref={addCampaignButtonRef}
              onClick={onOpen}
              icon={
                <Icon
                  as={Plus}
                  mt="calc(var(--chakra-space-1) + var(--chakra-space-0-5) / 2)"
                />
              }
              alignItems="start"
              py={4}
            >
              <Stack spacing={1}>
                <Text as="span" fontWeight="semibold">
                  Add campaign
                </Text>
                <Text colorScheme="gray" fontSize="sm">
                  A campaign is a separate page with it’s own roles and rewards,
                  highlighted at the top of your guild for everyone
                </Text>
              </Stack>
            </MenuItem>
          </MenuList>
        </Portal>
      </Menu>

      <FormProvider {...methods}>
        <CreateCampaignModal isOpen={isOpen} onClose={onClose} />
      </FormProvider>
    </>
  )
}

export default AddCampaignMenu
