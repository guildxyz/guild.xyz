import { Box, Button, Tooltip } from "@chakra-ui/react"
import LinkButton from "components/common/LinkButton"
import { useRouter } from "next/router"
import { PropsWithChildren } from "react"

type Props = {
  href: string
  disabled?: boolean
  tooltipText?: string
}

const TabButton = ({
  href,
  disabled = false,
  tooltipText = "Coming soon",
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const router = useRouter()
  const path = router.asPath.split("/")
  const currentPath = path.pop()
  const isActive = currentPath === href

  return !disabled ? (
    <LinkButton
      href={`${path.join("/")}/${href}`}
      colorScheme="gray"
      isActive={isActive}
      minW="max-content"
    >
      {children}
    </LinkButton>
  ) : (
    <Tooltip label={tooltipText} placement="bottom">
      <Box>
        <Button variant="ghost" disabled>
          {children}
        </Button>
      </Box>
    </Tooltip>
  )
}

export default TabButton
