import { Tooltip } from "@chakra-ui/react"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import useForms from "components/[guild]/hooks/useForms"
import useGuild from "components/[guild]/hooks/useGuild"
import LinkButton from "components/common/LinkButton"
import { ArrowSquareOut } from "phosphor-react"
import useUserSubmission from "platforms/Forms/hooks/useUserSubmission"
import platforms from "platforms/platforms"
import { PlatformType } from "types"

const FormReward = ({ platform, withMotionImg }: RewardProps) => {
  const { urlName } = useGuild()
  const { platformId, platformGuildData } = platform.guildPlatform
  const { data: forms, isValidating: isFormsValidating } = useForms()

  const form = forms?.find((f) => f.id === platformGuildData?.formId)

  const { data: userSubmission, isValidating: isUserSubmissionValidating } =
    useUserSubmission(form)

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
          <Tooltip
            label={!!userSubmission ? "Response already submitted" : "Go to form"}
            hasArrow
            shouldWrapChildren
          >
            <LinkButton
              isLoading={isFormsValidating || isUserSubmissionValidating}
              isDisabled={!!userSubmission}
              href={
                !userSubmission
                  ? `/${urlName}/forms/${platformGuildData.formId}`
                  : "#"
              }
              variant="link"
              rightIcon={<ArrowSquareOut />}
              iconSpacing="1"
              maxW="full"
            >
              {form?.name ?? platforms[PlatformType[platformId]].name}
            </LinkButton>
          </Tooltip>
        </>
      }
    />
  )
}
export default FormReward
