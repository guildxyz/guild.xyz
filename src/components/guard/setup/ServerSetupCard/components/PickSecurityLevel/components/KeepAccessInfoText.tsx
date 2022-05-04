import { Box, Text } from "@chakra-ui/react"
import useServerData from "hooks/useServerData"
import { useFormContext, useWatch } from "react-hook-form"

const KeepAccessInfoText = (): JSX.Element => {
  const { control } = useFormContext()
  const serverId = useWatch({ control, name: "serverId" })
  const { data } = useServerData(serverId)

  return (
    <Box px={5} pb={4} whiteSpace="break-spaces">
      <Text fontWeight="normal" fontSize="sm" lineHeight="150%">
        Existing members who already have any role in your server won't even notice
        the lockdown.
        <br />
        {`Existing members without any role (${data?.membersWithoutRole} users) will have to authenticate like new members.`}
      </Text>
    </Box>
  )
}

export default KeepAccessInfoText
