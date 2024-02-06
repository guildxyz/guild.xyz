import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import useForms from "components/[guild]/hooks/useForms"
import useGuild from "components/[guild]/hooks/useGuild"
import LinkButton from "components/common/LinkButton"
import { ArrowSquareOut } from "phosphor-react"
import platforms from "platforms/platforms"
import { PlatformType } from "types"

const FormReward = ({ platform, withMotionImg }: RewardProps) => {
  const { urlName } = useGuild()
  const { platformId, platformGuildData } = platform.guildPlatform
  const { data: forms } = useForms()

  const form = forms?.find((f) => f.id === platformGuildData?.formId)

  return (
    <RewardDisplay
      icon={
        <RewardIcon
          rolePlatformId={platform.id}
          guildPlatform={platform?.guildPlatform}
          withMotionImg={withMotionImg}
        />
      }
      label={
        <>
          {"Fill form: "}
          <LinkButton
            href={`/${urlName}/forms/${platformGuildData.formId}`}
            variant="link"
            rightIcon={<ArrowSquareOut />}
            iconSpacing="1"
            maxW="full"
          >
            {form?.name ?? platforms[PlatformType[platformId]].name}
          </LinkButton>
        </>
      }
    />
  )
}
export default FormReward
