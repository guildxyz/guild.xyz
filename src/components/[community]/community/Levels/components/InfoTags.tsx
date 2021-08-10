import { Stack, Text, useColorMode, Wrap } from "@chakra-ui/react"
import { Lock, LockOpen, LockSimpleOpen, Tag, Users } from "phosphor-react"
import type { Icon as IconType, RequirementType } from "temporaryData/types"
import msToReadableFormat from "utils/msToReadableFormat"

type Props = {
  stakeTimelockMs: number
  requirementType: RequirementType
  requirement: number
  membersCount: number
  tokenSymbol: string
}

const accessRequirementInfo = {
  OPEN: {
    label: "open",
    icon: LockSimpleOpen,
  },
  HOLD: {
    label: "hold",
    icon: LockOpen,
  },
  NFT_HOLD: {
    label: "hold NFT",
    icon: LockOpen,
  },
  STAKE: {
    label: "stake",
    icon: Lock,
  },
}

const mutagenNftNames = {
  1: "Prints",
  2: "Mutagens",
  0: "Geneses",
}

type ChildProps = {
  icon: IconType
  label: string
}

const InfoTag = ({ icon: Icon, label }: ChildProps): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Stack
      as="li"
      direction="row"
      textColor={colorMode === "light" ? "gray.450" : "gray.350"}
      alignItems="center"
      fontSize={{ base: "sm", md: "md" }}
      spacing={{ base: 1, sm: 2 }}
      pr={{ base: "2", md: "3" }}
    >
      <Icon size="1.3em" />
      <Text fontWeight="medium">{label}</Text>
    </Stack>
  )
}

const InfoTags = ({
  stakeTimelockMs,
  requirementType,
  requirement,
  membersCount,
  tokenSymbol,
}: Props): JSX.Element => (
  <Wrap direction="row" spacing={{ base: 2, lg: 4 }}>
    <InfoTag
      icon={accessRequirementInfo[requirementType].icon}
      label={`${accessRequirementInfo[requirementType].label} ${
        requirementType === "STAKE"
          ? `for ${msToReadableFormat(stakeTimelockMs)}`
          : ``
      }`}
    />
    {requirementType !== "OPEN" &&
      (requirementType === "NFT_HOLD" ? (
        <InfoTag icon={Tag} label={`1 ${mutagenNftNames[requirement]}`} />
      ) : (
        <InfoTag icon={Tag} label={`${requirement} ${tokenSymbol}`} />
      ))}
    <InfoTag icon={Users} label={`${membersCount} members`} />
  </Wrap>
)

export default InfoTags
