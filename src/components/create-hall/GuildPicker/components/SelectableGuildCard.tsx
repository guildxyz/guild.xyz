import {
  Box,
  Flex,
  Icon,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tooltip,
  Wrap,
} from "@chakra-ui/react"
import DisplayCard from "components/common/DisplayCard"
import { motion } from "framer-motion"
import useRequirementLabels from "hooks/useRequirementLabels"
import { Check, Users } from "phosphor-react"
import { useEffect, useState } from "react"
import { Guild } from "temporaryData/types"

const MotionBox = motion(Box)

type Props = {
  guildData: Guild
  defaultChecked?: boolean
  onChange?: (guildId: number, action: "add" | "remove") => void
}

const SelectableGuildCard = ({
  guildData,
  defaultChecked = false,
  onChange,
}: Props): JSX.Element => {
  const [isChecked, setIsChecked] = useState(defaultChecked)
  const requirementsString = useRequirementLabels(guildData.requirements)

  useEffect(() => {
    if (typeof onChange === "function")
      onChange(guildData.id, isChecked ? "add" : "remove")
  }, [isChecked])

  return (
    <MotionBox whileTap={{ scale: 0.98 }} h="full">
      <DisplayCard
        image={guildData.imageUrl}
        title={guildData.name}
        onClick={() => setIsChecked(!isChecked)}
        borderWidth={3}
        borderColor={isChecked ? "green.400" : "transparent"}
        cursor="pointer"
      >
        <Wrap zIndex="1">
          <Tag as="li">
            <TagLeftIcon as={Users} />
            <TagLabel>{guildData?.members?.length || 0}</TagLabel>
          </Tag>
          <Tooltip label={requirementsString}>
            <Tag as="li">
              <TagLabel>
                {(() => {
                  const reqCount = guildData.requirements?.length || 0
                  return `${reqCount} requirement${reqCount > 1 ? "s" : ""}`
                })()}
              </TagLabel>
            </Tag>
          </Tooltip>
        </Wrap>

        <Flex
          position="absolute"
          top={2}
          right={2}
          boxSize={6}
          alignItems="center"
          justifyContent="center"
          borderColor="whiteAlpha.300"
          borderWidth={isChecked ? 0 : 3}
          bgColor={isChecked ? "green.400" : "transparent"}
          color="white"
          rounded="full"
        >
          {isChecked && <Icon as={Check} />}
        </Flex>
      </DisplayCard>
    </MotionBox>
  )
}

export default SelectableGuildCard
