import { Box, Button, Collapse, Icon, Stack, useDisclosure } from "@chakra-ui/react"

import { CaretDown } from "@phosphor-icons/react"
import { forwardRef } from "react"
import capitalize from "utils/capitalize"

const CollapsibleRoleSection = forwardRef(
  (
    {
      roleCount,
      label,
      unmountOnExit = false,
      defaultIsOpen = false,
      children,
      ...rest
    }: any,
    ref
  ) => {
    const { isOpen, onToggle } = useDisclosure({ defaultIsOpen })

    return (
      <Box ref={ref} {...rest}>
        <Button
          variant="link"
          size="sm"
          fontWeight="bold"
          color="gray"
          rightIcon={
            <Icon
              as={CaretDown}
              transform={isOpen && "rotate(-180deg)"}
              transition="transform .3s"
            />
          }
          onClick={onToggle}
        >
          {capitalize(
            `${isOpen ? "" : "view "} ${roleCount} ${label} role${
              roleCount > 1 ? "s" : ""
            }`
          )}
        </Button>
        <Collapse
          in={isOpen}
          style={{ padding: "6px", margin: "-6px" }}
          unmountOnExit={unmountOnExit}
        >
          <Stack spacing={4} pt="3">
            {children}
          </Stack>
        </Collapse>
      </Box>
    )
  }
)

export default CollapsibleRoleSection
