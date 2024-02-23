import { MenuItem, MenuItemProps, Spinner } from "@chakra-ui/react"
import { ArrowRight } from "@phosphor-icons/react"
import Link from "next/link"
import { useState } from "react"

type Props = {
  href: string
} & MenuItemProps

const LinkMenuItem = ({ href, icon, children, ...rest }: Props) => {
  const [hasClicked, setHasClicked] = useState(false)

  return (
    <MenuItem
      as={Link}
      href={href}
      onClick={() => setHasClicked(true)}
      icon={hasClicked ? <Spinner size="xs" /> : icon}
      command={(<ArrowRight />) as any}
      isDisabled={hasClicked}
      closeOnSelect={false}
      {...rest}
    >
      {hasClicked ? "Redirecting" : children}
    </MenuItem>
  )
}

export default LinkMenuItem
