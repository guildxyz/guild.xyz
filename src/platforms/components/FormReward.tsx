import { Skeleton, Tooltip } from "@chakra-ui/react"
import {
  RewardDisplay,
  RewardIcon,
  RewardProps,
} from "components/[guild]/RoleCard/components/Reward"
import useGuild from "components/[guild]/hooks/useGuild"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import Button from "components/common/Button"
import Link from "next/link"
import { ArrowRight } from "phosphor-react"
import { useUserFormSubmission } from "platforms/Forms/hooks/useFormSubmissions"

const FormReward = ({ platform, withMotionImg }: RewardProps) => {
  const { urlName } = useGuild()
  const { platformGuildData } = platform.guildPlatform
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
          <Skeleton
            display="inline"
            isLoaded={!isFormsValidating && !isUserSubmissionValidating}
          >
            <Tooltip
              label={!!userSubmission ? "Response already submitted" : "Go to form"}
              hasArrow
              shouldWrapChildren
            >
              <Button
                as={Link}
                isDisabled={!!userSubmission}
                href={
                  !userSubmission
                    ? `/${urlName}/forms/${platformGuildData.formId}`
                    : "#"
                }
                variant="link"
                rightIcon={<ArrowRight />}
                iconSpacing="1"
                maxW="full"
              >
                {form?.name ?? "Unknown form"}
              </Button>
            </Tooltip>
          </Skeleton>
        </>
      }
    />
  )
}
export default FormReward
