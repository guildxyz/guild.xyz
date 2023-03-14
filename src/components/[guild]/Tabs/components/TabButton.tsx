import { Box, Tooltip } from "@chakra-ui/react"
import Button from "components/common/Button"
import LinkButton from "components/common/LinkButton"
import { useRouter } from "next/router"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  href: string
  disabled?: boolean
  tooltipText?: string
} & Rest

const TabButton = ({
  href,
  disabled = false,
  tooltipText = "Coming soon",
  children,
  ...rest
}: PropsWithChildren<Props>): JSX.Element => {
  const router = useRouter()
  const path = router.asPath.split("?")[0]
  const isActive = path?.split("#")?.[0] === href

  return !disabled ? (
    <LinkButton
      href={href}
      colorScheme="gray"
      variant="ghost"
      isActive={isActive}
      minW="max-content"
      {...rest}
    >
      {children}
    </LinkButton>
  ) : (
    <Tooltip label={tooltipText} placement="bottom">
      <Box>
        <Button variant="ghost" isDisabled {...rest}>
          {children}
        </Button>
      </Box>
    </Tooltip>
  )
}

export default TabButton
