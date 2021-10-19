import { HStack } from "@chakra-ui/react"
import LinkButton from "components/common/LinkButton"
import { useRouter } from "next/router"

const buttonStyle = {
  variant: "ghost",
  colorScheme: "gray",
  borderColor: "gray.700",
  borderWidth: 2,
  _active: {
    bg: "gray.700",
  },
}

const GroupsGuildsNav = () => {
  const router = useRouter()
  return (
    <HStack mb={8}>
      <LinkButton href="/" isActive={router.asPath === "/"} {...buttonStyle}>
        Guilds
      </LinkButton>
      <LinkButton
        href="/groups"
        isActive={router.asPath === "/groups"}
        {...buttonStyle}
      >
        Groups
      </LinkButton>
    </HStack>
  )
}

export default GroupsGuildsNav
