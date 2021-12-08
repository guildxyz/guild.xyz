import {
  Icon,
  IconButton,
  Img,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { useRouter } from "next/router"
import { DotsThreeVertical, Pencil, Plus } from "phosphor-react"
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
        <Icon width="1.25em" height="1.25em" as={DotsThreeVertical} />
      </MenuButton>
      <MenuList border="none" shadow="md">
        <CustomizationButton />
        <MenuItem
          py="2"
          cursor="pointer"
          onClick={() => router.push(`/${router.query.guild}/edit`)}
          icon={<Pencil />}
        >
          Edit guild
        </MenuItem>
        <MenuItem
          py="2"
          cursor="pointer"
          onClick={() => router.push(`/${router.query.guild}/add-role`)}
          icon={
            roles?.length > 1 ? (
              <Plus />
            ) : (
              <Img boxSize={3} src="/guildLogos/logo.svg" />
            )
          }
        >
          {roles?.length > 1 ? "Add role" : "Upgrade to Guild"}
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default EditButtonGroup
