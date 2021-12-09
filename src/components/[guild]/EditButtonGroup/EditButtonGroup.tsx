import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRouter } from "next/router"
import { GearSix, PencilSimple, Plus } from "phosphor-react"
import CustomizationButton from "./components/CustomizationButton"

const EditButtonGroup = (): JSX.Element => {
  const router = useRouter()
  const { roles } = useGuild()

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Settings"
        minW={12}
        rounded="2xl"
        colorScheme="alpha"
      >
        <Icon width="1em" height="1em" as={PencilSimple} />
      </MenuButton>
      <MenuList border="none" shadow="md">
        <MenuItem
          py="2"
          cursor="pointer"
          onClick={() => router.push(`/${router.query.guild}/edit`)}
          icon={<GearSix />}
        >
          Edit guild
        </MenuItem>
        <CustomizationButton />
        {roles?.[0]?.role?.rolePlatforms?.[0]?.platform?.name !== "DISCORD" && (
          <MenuItem
            py="2"
            cursor="pointer"
            onClick={() => router.push(`/${router.query.guild}/add-role`)}
            icon={<Plus />}
          >
            Add role
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  )
}

export default EditButtonGroup
