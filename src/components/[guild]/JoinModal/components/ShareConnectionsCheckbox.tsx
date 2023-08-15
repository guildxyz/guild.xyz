import { Checkbox, Icon, Link, Text } from "@chakra-ui/react"
import { ArrowSquareOut } from "phosphor-react"
import { useFormContext } from "react-hook-form"

const ShareConnectionsCheckbox = (): JSX.Element => {
  const { setValue, watch } = useFormContext()

  const shareConnections = watch("shareConnections")

  return (
    <Checkbox
      alignItems="start"
      pb={4}
      isChecked={shareConnections}
      onChange={(e) => setValue("shareConnections", e.target.checked)}
      size="sm"
    >
      <Text colorScheme="gray" mt="-5px">
        {`I agree to share my connections with the guild owner, so they can potentially
        reward me for my engagement in the community. `}
        <Link isExternal fontWeight={"semibold"}>
          Learn more
          <Icon as={ArrowSquareOut} ml="0.5" />
        </Link>
      </Text>
    </Checkbox>
  )
}

export default ShareConnectionsCheckbox
