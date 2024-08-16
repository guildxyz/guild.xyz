import { Skeleton, Tooltip } from "@chakra-ui/react"
import { ArrowRight } from "@phosphor-icons/react"
import { RewardIcon } from "components/[guild]/RoleCard/components/Reward"
import { RewardDisplay } from "components/[guild]/RoleCard/components/RewardDisplay"
import { RewardProps } from "components/[guild]/RoleCard/components/types"
import useGuild from "components/[guild]/hooks/useGuild"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import Button from "components/common/Button"
import Link from "next/link"
import { useUserFormSubmission } from "rewards/Forms/hooks/useFormSubmissions"

const FormReward = ({ platform }: RewardProps) => {
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
