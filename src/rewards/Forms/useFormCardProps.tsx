import {
  Circle,
  Icon,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import { GuildPlatformWithOptionalId, PlatformName } from "types"
import pluralize from "utils/pluralize"
import { useUserFormSubmission } from "./hooks/useFormSubmissions"
import { formData } from "./data"
import { CardPropsHook } from "rewards/types"

const useFormCardProps: CardPropsHook = (
  guildPlatform: GuildPlatformWithOptionalId
) => {
  const { isAdmin } = useGuildPermission()
  const circleBgColor = useColorModeValue("gray.700", "blackAlpha.300")

  const { form, isSigned } = useGuildForm(guildPlatform?.platformGuildData?.formId)
  const { userSubmission } = useUserFormSubmission(form ?? null)

  return {
    type: "FORM" as PlatformName,
    image: (
      <Circle size={10} bgColor={circleBgColor}>
        <Icon as={formData?.icon} color="white" />
      </Circle>
    ),
    name: form?.name || formData.name,
    info:
      isSigned && isAdmin ? (
        <SubmissionCount submissionCount={form?.submissionCount ?? 0} />
      ) : undefined,
    shouldHide: !isAdmin && !!userSubmission,
  }
}

const SubmissionCount = ({ submissionCount }: { submissionCount: number }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Text
      colorScheme="gray"
      fontSize={"sm"}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      {isOpen
        ? submissionCount
        : `${new Intl.NumberFormat("en", { notation: "compact" }).format(
            submissionCount
          )}`}
      {` ${pluralize(submissionCount, "response", false)}`}
    </Text>
  )
}
export default useFormCardProps
