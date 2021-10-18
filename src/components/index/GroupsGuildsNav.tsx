import { HStack } from "@chakra-ui/react"
import LinkButton from "components/common/LinkButton"
import { useRouter } from "next/router"

const buttonStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  mr: 2,
  pl: 4,
  pr: 4,
  borderColor: "gray.700",
  borderWidth: 2,
  borderRadius: "xl",
}

const GroupsGuildsNav = () => {
  const router = useRouter()
  return (
    <HStack mb={8}>
      <LinkButton
        href="/"
        variant="unstyled"
        bgColor={router.asPath === "/" && "gray.700"}
        {...buttonStyle}
      >
        Guilds
      </LinkButton>
      <LinkButton
        href="/groups"
        variant="unstyled"
        bgColor={router.asPath === "/groups" && "gray.700"}
        {...buttonStyle}
      >
        Groups
      </LinkButton>
    </HStack>
  )
}

export default GroupsGuildsNav
