import {
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { useCommunity } from "components/community/Context"
import InfoTags from "components/community/Levels/components/InfoTags"
import { CheckCircle } from "phosphor-react"
import { useEffect, useRef, useState } from "react"
import type { Level as LevelType } from "temporaryData/types"
import StakingModal from "../StakingModal"
import useLevelAccess from "./hooks/useLevelAccess"

type Props = {
  data: LevelType
  index?: number
  onChangeHandler?: (levelData: LevelData) => void
}

type LevelData = {
  index: number
  status: "idle" | "access" | "focus"
  isDisabled: boolean
  element: HTMLElement
}

const Level = ({ data, index, onChangeHandler }: Props): JSX.Element => {
  const {
    chainData: {
      token: { symbol: tokenSymbol },
    },
  } = useCommunity()
  const {
    isOpen: isStakingModalOpen,
    onOpen: onStakingModalOpen,
    onClose: onStakingModalClose,
  } = useDisclosure()
  const [hasAccess, noAccessMessage] = useLevelAccess(data.accessRequirement)

  const levelEl = useRef(null)
  const [levelData, setLevelData] = useState<LevelData>({
    index,
    status: "idle",
    isDisabled: true,
    element: null,
  })

  useEffect(() => {
    const ref = levelEl.current

    const mouseEnterHandler = () => {
      setLevelData((prevState) => ({
        ...prevState,
        status: prevState.status === "access" ? "access" : "focus",
      }))
    }

    const mouseLeaveHandler = () => {
      setLevelData((prevState) => ({
        ...prevState,
        status: prevState.status === "access" ? "access" : "idle",
      }))
    }

    ref.addEventListener("mouseenter", mouseEnterHandler)
    ref.addEventListener("mouseleave", mouseLeaveHandler)

    return () => {
      ref.removeEventListener("mouseenter", mouseEnterHandler)
      ref.removeEventListener("mouseleave", mouseLeaveHandler)
    }
  }, [])

  useEffect(() => {
    setLevelData((prevState) => ({
      ...prevState,
      status: hasAccess ? "access" : "idle",
      isDisabled: noAccessMessage.length > 0,
      element: levelEl.current,
    }))
  }, [hasAccess, noAccessMessage, levelEl])

  useEffect(() => {
    if (!isStakingModalOpen && levelData.status === "focus") {
      setLevelData((prevState) => ({
        ...prevState,
        status: hasAccess ? "access" : "idle",
      }))
    }
  }, [isStakingModalOpen])

  useEffect(() => {
    if (isStakingModalOpen && levelData.status !== "focus") {
      setLevelData((prevState) => ({
        ...prevState,
        status: "focus",
      }))
    }

    if (onChangeHandler) {
      onChangeHandler(levelData)
    }
  }, [levelData, isStakingModalOpen])

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      boxSizing="border-box"
      py="10"
      borderBottom="1px"
      borderBottomColor="gray.200"
      _last={{ borderBottom: 0 }}
      ref={levelEl}
    >
      <Stack direction="row" spacing="6">
        <Image src={`${data.imageUrl}`} boxSize="45px" alt="Level logo" />
        <Stack>
          <Heading size="sm">{data.name}</Heading>
          <InfoTags
            data={data.accessRequirement}
            membersCount={data.membersCount}
            tokenSymbol={tokenSymbol}
          />
          {data.desc && <Text pt="4">{data.desc}</Text>}
        </Stack>
      </Stack>
      <Stack alignItems="flex-end" justifyContent="center">
        {hasAccess && (
          <HStack spacing="3">
            <Text fontWeight="medium">You have access</Text>
            <CheckCircle
              color="var(--chakra-colors-green-500)"
              weight="fill"
              size="26"
            />
          </HStack>
        )}
        {!hasAccess && data.accessRequirement.type === "stake" && (
          <Button
            colorScheme="primary"
            fontWeight="medium"
            onClick={onStakingModalOpen}
            disabled={!!noAccessMessage}
          >
            Stake to join
          </Button>
        )}
        {!hasAccess &&
          data.accessRequirement.type === "stake" &&
          !noAccessMessage && (
            <StakingModal
              levelName={data.name}
              accessRequirement={data.accessRequirement}
              isOpen={isStakingModalOpen}
              onClose={onStakingModalClose}
            />
          )}
        {noAccessMessage && <Text fontWeight="medium">{noAccessMessage}</Text>}
      </Stack>
    </Flex>
  )
}

export { Level }
export type { LevelData }
