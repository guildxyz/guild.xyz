import { Box, Text } from "@chakra-ui/react"

const KeepAccessInfoText = (): JSX.Element => (
  <Box px={5} pb={4} whiteSpace="break-spaces">
    <Text fontWeight="normal" fontSize="sm" lineHeight="150%">
      Existing members who already have any role in your server won't even notice the
      lockdown.
      <br />
      Existing members without any role will have to authenticate like new members.
    </Text>
  </Box>
)

export default KeepAccessInfoText
