import { Anchor, anchorVariants } from "@/components/ui/Anchor"
import { Skeleton } from "@/components/ui/Skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { PencilSimpleLine } from "@phosphor-icons/react/dist/ssr"
import {
  Requirement,
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import useGuild from "components/[guild]/hooks/useGuild"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import { useUserFormSubmission } from "rewards/Forms/hooks/useFormSubmissions"

const FormRequirement = (props: RequirementProps) => {
  const { urlName } = useGuild()
  const { data } = useRequirementContext()
  const { form } = useGuildForm(data?.id)
  const { userSubmission } = useUserFormSubmission(form)

  return (
    <Requirement image={<PencilSimpleLine className="size-6" />} {...props}>
      <span>{"Fill the "}</span>

      {!form ? (
        <Skeleton className="inline-block h-5 w-40" />
      ) : !!userSubmission ? (
        <Tooltip open={!userSubmission ? false : undefined}>
          <TooltipTrigger asChild>
            <span
              className={anchorVariants({
                variant: "highlighted",
                className: "cursor-not-allowed opacity-60 hover:no-underline",
              })}
            >
              {form.name}
            </span>
          </TooltipTrigger>

          <TooltipPortal>
            <TooltipContent side="top">
              <p>Response already submitted</p>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      ) : (
        <Anchor
          href={`/${urlName}/forms/${form?.id}`}
          prefetch={false}
          variant="highlighted"
        >
          {form.name}
        </Anchor>
      )}
      <span>{` form ${data.answers?.length ? "with specified answers" : ""}`}</span>
    </Requirement>
  )
}
export default FormRequirement
