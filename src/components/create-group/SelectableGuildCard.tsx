import {
  Flex,
  Icon,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import RequirementsTags from "components/index/GuildCard/components/RequirementsTags"
import { motion } from "framer-motion"
import { Check, Users } from "phosphor-react"
import { useEffect, useState } from "react"
import { Guild } from "temporaryData/types"

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

  useEffect(() => {
    if (typeof onChange === "function")
      onChange(guildData.id, isChecked ? "add" : "remove")
  }, [isChecked])

  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Card
        onClick={() => setIsChecked(!isChecked)}
        role="group"
        position="relative"
        px={{ base: 5, sm: 7 }}
        py="7"
        w="full"
        h="full"
        bg="gray.700"
        borderWidth={3}
        borderColor={isChecked ? "green.400" : "transparent"}
        justifyContent="center"
        cursor="pointer"
        _before={{
          content: `""`,
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          bg: "primary.300",
          borderRadius: "xl",
          opacity: 0,
          transition: "opacity 0.2s",
        }}
        _hover={{
          _before: {
            opacity: 0.1,
          },
        }}
        _active={{
          _before: {
            opacity: 0.17,
          },
        }}
      >
        <VStack spacing={3} alignItems="start">
          <Text
            fontFamily="display"
            fontSize="xl"
            fontWeight="bold"
            letterSpacing="wide"
          >
            {guildData.name}
          </Text>
          <Wrap>
            <Tag as="li">
              <TagLeftIcon as={Users} />
              <TagLabel>{guildData.levels?.[0]?.members?.length || 0}</TagLabel>
            </Tag>
            <RequirementsTags requirements={guildData?.levels?.[0]?.requirements} />
          </Wrap>
        </VStack>

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
      </Card>
    </motion.div>
  )
}

export default SelectableGuildCard
