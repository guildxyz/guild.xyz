import { MenuItem, MenuItemProps, Spinner } from "@chakra-ui/react"
import Link from "next/link"
import { ArrowRight } from "phosphor-react"
import { useState } from "react"

type Props = {
  href: string
} & MenuItemProps

const LinkMenuItem = ({ href, icon, children, ...rest }: Props) => {
  const [hasClicked, setHasClicked] = useState(false)

  return (
    <Link passHref href={href}>
      <MenuItem
        onClick={() => setHasClicked(true)}
        as="a"
        icon={hasClicked ? <Spinner size="xs" /> : icon}
        command={(<ArrowRight />) as any}
        isDisabled={hasClicked}
        closeOnSelect={false}
        {...rest}
      >
        {hasClicked ? "Redirecting" : children}
      </MenuItem>
    </Link>
  )
}

export default LinkMenuItem
