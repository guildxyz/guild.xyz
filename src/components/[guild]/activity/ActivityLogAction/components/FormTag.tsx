import {
  Button,
  Circle,
  forwardRef,
  HStack,
  Tag,
  TagProps,
  TagRightIcon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import { Schemas } from "@guildxyz/types"
import {
  DotsThreeVertical,
  Funnel,
  IconProps,
  PencilSimpleLine,
} from "phosphor-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"
import useSWRImmutable from "swr/immutable"
import { useActivityLog } from "../../ActivityLogContext"
import {
  FILTER_NAMES,
  useActivityLogFilters,
} from "../../ActivityLogFiltersBar/components/ActivityLogFiltersContext"
import ClickableTagPopover from "./ClickableTagPopover"
import ViewInFormResponses from "./ClickableTagPopover/components/ViewInFormResponses"

type FormTagProps = { formId: number; guildId: number }

type Props = FormTagProps &
  Omit<TagProps, "colorScheme"> & {
    rightIcon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
  }

const FormTag = forwardRef<Props, "span">(
  ({ formId, guildId, rightIcon, ...tagProps }: Props, ref): JSX.Element => {
    const { data } = useSWRImmutable<Schemas["Form"]>(
      `/v2/guilds/${guildId}/forms/${formId}`
    )

    const tagColorScheme = useColorModeValue("alpha", "blackalpha")
    const imgBgColor = useColorModeValue("gray.700", "gray.600")

    return (
      <Tag
        ref={ref}
        colorScheme={tagColorScheme}
        minW="max-content"
        h="max-content"
        {...tagProps}
      >
        {!data?.name ? (
          "Unknown form"
        ) : (
          <HStack spacing={1}>
            <Circle bgColor={imgBgColor} size={4}>
              <PencilSimpleLine />
            </Circle>
            <Text as="span" w="max-content">
              {data?.name}
            </Text>
          </HStack>
        )}

        {rightIcon && <TagRightIcon as={rightIcon} />}
      </Tag>
    )
  }
)

type ClickableFormTagProps = FormTagProps & {
  userId?: number
}

const ClickableFormTag = ({
  formId,
  guildId,
  userId,
}: ClickableFormTagProps): JSX.Element => {
  const { addFilter, activeFilters } = useActivityLogFilters() ?? {}
  const { activityLogType } = useActivityLog()

  const isDisabled =
    !formId ||
    !addFilter ||
    !!activeFilters.find(
      (f) => f.filter === "formId" && f.value === formId.toString()
    )
  return (
    <ClickableTagPopover
      options={
        <>
          <Button
            variant="ghost"
            leftIcon={<Funnel />}
            size="sm"
            borderRadius={0}
            onClick={() => {
              if (activityLogType !== "guild") {
                addFilter({ filter: "guildId", value: guildId.toString() })
              }
              addFilter({ filter: "formId", value: formId.toString() })
            }}
            isDisabled={isDisabled}
            justifyContent="start"
          >
            {`Filter by ${FILTER_NAMES.formId?.toLowerCase()}`}
          </Button>
          {(activityLogType === "guild" || activityLogType === "all") && (
            <ViewInFormResponses
              label="view response in submissions"
              formId={formId}
              guildId={guildId}
              userId={userId}
            />
          )}
        </>
      }
    >
      <FormTag
        formId={formId}
        guildId={guildId}
        rightIcon={DotsThreeVertical}
        cursor="pointer"
      />
    </ClickableTagPopover>
  )
}

export default FormTag
export { ClickableFormTag }
