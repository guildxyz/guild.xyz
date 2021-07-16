import { Stack, Text, Wrap } from "@chakra-ui/react"
import { Lock, LockOpen, LockSimpleOpen, Tag, Users } from "phosphor-react"
import type { AccessRequirement } from "temporaryData/types"
import msToReadableFormat from "utils/msToReadableFormat"

type Props = {
  data: AccessRequirement
  membersCount: number
  tokenSymbol: string
}

const accessRequirementIcons = {
  open: LockSimpleOpen,
  hold: LockOpen,
  stake: Lock,
}

type ChildProps = {
  icon: React.ElementType
  label: string
}

const InfoTag = ({ icon: Icon, label }: ChildProps): JSX.Element => (
  <Stack
    as="li"
    direction="row"
    textColor="gray.450"
    alignItems="center"
    fontSize={{ base: "sm", md: "md" }}
    spacing={{ base: 1, sm: 2 }}
    pr={{ base: "2", md: "3" }}
  >
    <Icon size="1.3em" />
    <Text fontWeight="medium">{label}</Text>
  </Stack>
)

const InfoTags = ({ data, membersCount, tokenSymbol }: Props): JSX.Element => (
  <Wrap direction="row" spacing={{ base: 2, lg: 4 }}>
    <InfoTag
      icon={accessRequirementIcons[data.type]}
      label={`${data.type} ${
        data.type === "stake" ? `for ${msToReadableFormat(data.timelockMs)}` : ``
      }`}
    />
    {data.type !== "open" && (
      <InfoTag icon={Tag} label={`${data.amount} ${tokenSymbol}`} />
    )}
    <InfoTag icon={Users} label={`${membersCount} members`} />
  </Wrap>
)

export default InfoTags
