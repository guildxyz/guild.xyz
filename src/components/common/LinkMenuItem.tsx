import { ButtonProps, MenuItem, MenuItemProps, Spinner } from "@chakra-ui/react"
import Link, { LinkProps } from "next/link"
import { useState } from "react"
import { PiArrowRight } from "react-icons/pi"
import Button from "./Button"

const LinkMenuItem = ({ icon, children, ...rest }: MenuItemProps & LinkProps) => {
  const [hasClicked, setHasClicked] = useState(false)

  return (
    <MenuItem
      as={Link}
      onClick={() => setHasClicked(true)}
      icon={hasClicked ? <Spinner size="xs" /> : icon}
      command={(<PiArrowRight />) as any}
      isDisabled={hasClicked}
      closeOnSelect={false}
      {...rest}
    >
      {hasClicked ? "Redirecting" : children}
    </MenuItem>
  )
}

const LinkButton = ({ children, ...rest }: ButtonProps & LinkProps) => {
  const [hasClicked, setHasClicked] = useState(false)

  return (
    <Button
      as={Link}
      onClick={() => setHasClicked(true)}
      rightIcon={(<PiArrowRight />) as any}
      isLoading={hasClicked}
      loadingText={"Redirecting"}
      {...rest}
    >
      {children}
    </Button>
  )
}

export default LinkMenuItem
export { LinkButton }
