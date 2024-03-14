import { Tooltip } from "@chakra-ui/react"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import useGuild from "components/[guild]/hooks/useGuild"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import Button from "components/common/Button"
import Link from "next/link"
import { ArrowSquareOut } from "phosphor-react"
import { useUserFormSubmission } from "platforms/Forms/hooks/useFormSubmissions"
import rewards from "platforms/rewards"
import { PlatformType } from "types"

const FormReward = ({ platform, withMotionImg }: RewardProps) => {
  const { urlName } = useGuild()
  const { platformId, platformGuildData } = platform.guildPlatform
  const { form, isValidating: isFormsValidating } = useGuildForm(
    platformGuildData?.formId
  )

  const { userSubmission, isValidating: isUserSubmissionValidating } =
    useUserFormSubmission(form)

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
            <Button
              as={Link}
              isLoading={isFormsValidating || isUserSubmissionValidating}
              isDisabled={!!userSubmission}
              href={
                !userSubmission
                  ? `/${urlName}/forms/${platformGuildData.formId}`
                  : "#"
              }
              variant="link"
              colorScheme="primary"
              rightIcon={<ArrowSquareOut />}
              iconSpacing="1"
              maxW="full"
            >
              {form?.name ?? rewards[PlatformType[platformId]].name}
            </Button>
          </Tooltip>
        </>
      }
    />
  )
}
export default FormReward
