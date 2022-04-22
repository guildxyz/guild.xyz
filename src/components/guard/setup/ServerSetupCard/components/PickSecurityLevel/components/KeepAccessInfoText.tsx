import { Box, Text } from "@chakra-ui/react"
import useServerData from "components/create-guild/PickRolePlatform/components/Discord/hooks/useServerData"
import { useFormContext, useWatch } from "react-hook-form"

const KeepAccessInfoText = (): JSX.Element => {
  const { control } = useFormContext()
  const serverId = useWatch({ control, name: "serverId" })
  const { data } = useServerData(serverId)

  return (
    <Box px={5} pb={4} whiteSpace="break-spaces">
      <Text fontWeight="normal" fontSize="sm" lineHeight="150%">
        {`Keep access for users with any role in your server. There are ${data?.membersWithoutRole} members without any role, if you want them to auto-access too, give them a role!`}
      </Text>
    </Box>
  )
}

export default KeepAccessInfoText
