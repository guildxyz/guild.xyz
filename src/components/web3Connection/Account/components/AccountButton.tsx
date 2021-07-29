import { Button } from "@chakra-ui/react"

const AccountButton = ({ children, ...rest }): JSX.Element => (
  <Button
    variant="ghost"
    flexGrow={1}
    /**
     * Space 11 is added to the theme by us and Chakra doesn't recognize it just by
     * "11" for some reason
     */
    h={{ base: 14, md: "var(--chakra-space-11)" }}
    borderRadius="0"
    {...rest}
  >
    {children}
  </Button>
)

export default AccountButton
