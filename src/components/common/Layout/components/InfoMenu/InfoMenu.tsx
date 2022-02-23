import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react"
import HamburgerMenu from "components/create-guild/Requirements/components/HamburgerMenu"
import XIcon from "components/create-guild/Requirements/components/XIcon"
import useUpvoty from "./hooks/useUpvoty"

const InfoMenu = (): JSX.Element => {
  const { url: upvotyUrl } = useUpvoty()

  return (
    <Menu>
      <MenuButton
        as={Button}
        aria-label="Agora logo"
        variant="ghost"
        icon={<HamburgerMenu />}
      />
      <HamburgerMenu />
      {/* have to set zIndex, otherwise the search bar's icon lays over it */}
      <MenuList border="none" shadow="md" zIndex="3" bgColor="#637C8C">
        <MenuGroup
          title={
            (
              <>
                <Icon as={XIcon} ml="1" />
              </>
            ) as any
          }
          pb="2"
        >
          <MenuItem
            justifyContent="center"
            py="2"
            as="a"
            href="/get-a-dragontail"
            rel="noopener"
          >
            get a dragontail
          </MenuItem>
          <MenuItem
            justifyContent="center"
            py="2"
            as="a"
            href="/flavortown"
            rel="noopener"
          >
            join guild
          </MenuItem>
          <MenuItem
            justifyContent="center"
            py="2"
            as="a"
            rel="noopener"
            href="/stake-magic"
          >
            stake $MAGIC
          </MenuItem>
          <MenuItem
            justifyContent="center"
            py="2"
            as="a"
            href="/stake-treasure"
            rel="noopener"
          >
            stake treasure and legion
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}

export default InfoMenu
