import {
  forwardRef,
  HStack,
  Icon,
  Tag,
  TagProps,
  TagRightIcon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { DotsThreeVertical, IconProps } from "@phosphor-icons/react"
import { ForwardRefExoticComponent, RefAttributes } from "react"
import rewards from "rewards"
import { useActivityLog } from "../../ActivityLogContext"
import ClickableTagPopover from "./ClickableTagPopover"
import FilterBy from "./ClickableTagPopover/components/FilterBy"
import ViewInFormResponses from "./ClickableTagPopover/components/ViewInFormResponses"

type FormTagProps = { formId: number }

type Props = FormTagProps &
  Omit<TagProps, "colorScheme"> & {
    rightIcon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
  }

const FormTag = forwardRef<Props, "span">(
  ({ formId, rightIcon, ...tagProps }: Props, ref): JSX.Element => {
    const { data } = useActivityLog()
    const form = data?.values.forms.find((f) => f.id === formId)

    const tagColorScheme = useColorModeValue("alpha", "blackalpha")

    return (
      <Tag
        ref={ref}
        colorScheme={tagColorScheme}
        minW="max-content"
        h="max-content"
        {...tagProps}
      >
        <HStack spacing={1}>
          <Icon as={rewards.FORM.icon} />

          <Text as="span" w="max-content">
            {form?.name ?? "Unknown form"}
          </Text>
        </HStack>

        {rightIcon && <TagRightIcon as={rightIcon} />}
      </Tag>
    )
  }
)

type ClickableFormTagProps = FormTagProps & {
  guildId: number
  userId: number
}

const ClickableFormTag = ({
  formId,
  guildId,
  userId,
}: ClickableFormTagProps): JSX.Element => {
  const { activityLogType } = useActivityLog()

  return (
    <ClickableTagPopover
      options={
        <>
          <FilterBy
            filter={{
              filter: "formId",
              value: formId?.toString(),
            }}
          />
          {(activityLogType === "guild" || activityLogType === "all") &&
            !!formId && (
              <ViewInFormResponses
                label="View response in submissions"
                guildId={guildId}
                formId={formId}
                userId={userId}
              />
            )}
        </>
      }
    >
      <FormTag formId={formId} rightIcon={DotsThreeVertical} cursor="pointer" />
    </ClickableTagPopover>
  )
}

export default FormTag
export { ClickableFormTag }
