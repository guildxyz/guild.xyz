import { Checkbox, Icon, Link, Text } from "@chakra-ui/react"
import { usePostHogContext } from "components/_app/PostHogProvider"
import { ArrowSquareOut } from "phosphor-react"
import { useFormContext } from "react-hook-form"

const ShareSocialsCheckbox = (): JSX.Element => {
  const { setValue, watch } = useFormContext()
  const { captureEvent } = usePostHogContext()

  const shareSocials = watch("shareSocials")

  return (
    <Checkbox
      alignItems="start"
      pb={4}
      isChecked={shareSocials}
      onChange={(e) => {
        setValue("shareSocials", e.target.checked)
        captureEvent("shareSocialsCheckbox change", { checked: e.target.checked })
      }}
      size="sm"
    >
      <Text colorScheme="gray" mt="-5px">
        {`I agree to share my profile with the guild, so they can potentially
        reward me for my engagement in the community. `}
        <Link
          href="https://help.guild.xyz/en/articles/8489031-privacy-for-members"
          isExternal
          fontWeight={"semibold"}
          onClick={(e) => e.stopPropagation()}
        >
          Learn more
          <Icon as={ArrowSquareOut} ml="0.5" />
        </Link>
      </Text>
    </Checkbox>
  )
}

export default ShareSocialsCheckbox
