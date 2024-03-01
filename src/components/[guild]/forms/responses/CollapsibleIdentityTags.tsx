import { Center, Collapse, Icon, IconButton } from "@chakra-ui/react"
import { CaretDown } from "@phosphor-icons/react"
import { WalletTag } from "components/[guild]/crm/Identities"
import UserPlatformTags from "components/[guild]/crm/UserPlatformTags"
import useGuild from "components/[guild]/hooks/useGuild"
import { LinkButton } from "components/common/LinkMenuItem"
import useResolveAddress from "hooks/useResolveAddress"
import { useState } from "react"
import shortenHex from "utils/shortenHex"

const CollapsibleIdentityTags = ({ addresses, platformUsers, isShared }) => {
  const { urlName, featureFlags } = useGuild()

  /**
   * Double state for delaying so the Collapse wrapper can fetch auto height on open
   * based on the by then already changed children dimensions
   */
  const [isOpen, setIsOpen] = useState({ wrapper: false, children: false })

  const toggleTags = () => {
    let prevOpen
    setIsOpen((prev) => {
      prevOpen = prev.children
      // on open, we start with the children, on close, with the wrapper - so this work both ways
      return { wrapper: false, children: true }
    })

    setTimeout(() => {
      setIsOpen(
        prevOpen
          ? { wrapper: false, children: false }
          : { wrapper: true, children: true },
      )
    }, 100)
  }

  return (
    <Collapse in={isOpen.wrapper} startingHeight={24} animateOpacity={false}>
      <UserPlatformTags
        {...{ platformUsers, isShared }}
        spacing="1"
        isOpen={isOpen.children}
        sx={
          !isOpen.children && {
            ".identityTag:not(:first-child)": {
              marginLeft: "var(--stacked-margin-left)",
            },
          }
        }
      >
        <CollapsibleWalletTag
          {...{ addresses, platformUsers, isCollapseOpen: isOpen }}
        />
        {featureFlags.includes("CRM") && isOpen.children && (
          <LinkButton
            href={`/${urlName}/members?search=${addresses?.[0]}`}
            size="xs"
            borderRadius="md"
            borderWidth="1.5px"
            variant="outline"
          >
            View in members
          </LinkButton>
        )}
        <IconButton
          size="xs"
          icon={
            <Icon
              as={CaretDown}
              transform={isOpen.children && "rotate(-180deg)"}
              transition="transform .3s"
            />
          }
          borderRadius="md"
          variant="ghost"
          aria-label="Expand"
          onClick={toggleTags}
        />
      </UserPlatformTags>
    </Collapse>
  )
}

const CollapsibleWalletTag = ({ addresses, platformUsers, isCollapseOpen }) => {
  const primaryAddress = addresses?.[0]
  const domain = useResolveAddress(primaryAddress)

  const isOpen = isCollapseOpen.children || !platformUsers.length

  return (
    <WalletTag
      tabIndex={0}
      order={!platformUsers.length && "-1"} // so it's before the "private socials" / "no connections" tag
      zIndex={"-10"} // so it's under every other tag stacked
      overflow={"hidden"}
      rightElement={
        addresses?.length > 1 &&
        isOpen && (
          <Center bgColor="blackAlpha.300" h={6} px={1.5} ml={2} mr={-1.5}>
            {`+${addresses?.length - 1}`}
          </Center>
        )
      }
      ml={!platformUsers.length && "unset !important"}
    >
      {isOpen ? domain || shortenHex(primaryAddress ?? "") : addresses?.length}
    </WalletTag>
  )
}

export default CollapsibleIdentityTags
