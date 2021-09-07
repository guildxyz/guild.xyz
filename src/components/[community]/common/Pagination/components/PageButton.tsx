import { Button, useColorMode } from "@chakra-ui/react"
import LinkButton from "components/common/LinkButton"
import { useRouter } from "next/router"
import { PropsWithChildren, useMemo } from "react"

type Props = {
  isAdminPage?: boolean
  href: string
  disabled?: boolean
}

const PageButton = ({
  isAdminPage = false,
  href,
  disabled = false,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const router = useRouter()
  const [, communityUrl, ...currentPath] = router.asPath.split("/")
  const isActive = currentPath.filter((str) => str !== "admin").join("/") === href
  const { colorMode } = useColorMode()
  const gray = useMemo(
    () => (colorMode === "light" ? "gray.600" : "gray.400"),
    [colorMode]
  )

  return !disabled ? (
    <LinkButton
      href={
        isAdminPage ? `/${communityUrl}/admin/${href}` : `/${communityUrl}/${href}`
      }
      variant="ghost"
      isActive={isActive}
      color={(!isActive && gray) || undefined}
    >
      {children}
    </LinkButton>
  ) : (
    <Button variant="ghost" disabled color={gray}>
      {children}
    </Button>
  )
}

export default PageButton
