import {
  Heading,
  Img,
  Portal,
  Stack,
  Tag,
  useColorMode,
  Wrap,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import Link from "components/common/Link"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import useMemberCount from "components/[community]/hooks/useMemberCount"
import useLevelAccess from "components/[community]/Levels/components/Level/hooks/useLevelAccess"
import { Chains } from "connectors"
import React, { MutableRefObject } from "react"
import { ChainData, Community } from "temporaryData/types"

type Props = {
  refAccess: MutableRefObject<HTMLDivElement>
  community: Community
}

const WrappedCard = ({ community, refAccess }: Props): JSX.Element => {
  const { chainId } = useWeb3React()

  const currentChainData = community.chainData.find(
    (_) => Chains[_.name] === chainId
  )

  const [hasAccess] = useLevelAccess(
    community.levels.length ? community.levels[0].requirementType : "HOLD",
    community.levels.length ? community.levels[0].requirement : -1,
    currentChainData?.token,
    currentChainData?.stakeToken,
    Chains[currentChainData?.name]
  )

  if (hasAccess)
    return (
      <Portal containerRef={refAccess}>
        <CommunityCard community={community} currentChainData={currentChainData} />
      </Portal>
    )

  return <CommunityCard community={community} currentChainData={currentChainData} />
}

const CommunityCard = ({
  community: {
    themeColor,
    levels,
    urlName,
    imageUrl,
    name,
    marketcap,
    chainData,
    id,
    holdersCount,
  },
  currentChainData: _currentChainData,
}: {
  community: Community
  currentChainData: ChainData
}) => {
  const { colorMode } = useColorMode()
  const currentChainData = _currentChainData ?? chainData[0]

  const generatedColors = useColorPalette("chakra-colors-primary", themeColor)
  const { sum: membersCount } = useMemberCount(id)

  return (
    <Link
      href={`/${urlName}`}
      _hover={{ textDecor: "none" }}
      borderRadius="2xl"
      w="full"
      sx={generatedColors}
    >
      <Card
        role="group"
        px={{ base: 5, sm: 7 }}
        py="7"
        w="full"
        bgGradient={`linear(to-l, var(--chakra-colors-primary-100), ${
          colorMode === "light" ? "white" : "var(--chakra-colors-gray-800)"
        })`}
        bgBlendMode={colorMode === "light" ? "normal" : "color"}
        bgRepeat="no-repeat"
        bgSize="400%"
        transition="background-size 0.8s ease"
        _hover={{
          bgSize: "100%",
          transition: "background-size 0.24s ease",
        }}
      >
        <Stack
          position="relative"
          direction="row"
          spacing={{ base: 5, sm: 10 }}
          alignItems="center"
        >
          <Img
            src={`${imageUrl}`}
            boxSize="45px"
            alt={`${name} logo`}
            borderRadius="full"
          />
          <Stack spacing="3">
            <Heading size="sm">{name}</Heading>
            {levels.length ? (
              <Wrap spacing="2" shouldWrapChildren>
                <Tag colorScheme="alpha">{`${membersCount} members`}</Tag>
                <Tag colorScheme="alpha">{`${levels.length} levels`}</Tag>
                <Tag colorScheme="alpha">
                  {`min: ${levels[0]?.requirement ?? 0} ${
                    currentChainData.token.symbol
                  }`}
                </Tag>
              </Wrap>
            ) : (
              <Wrap shouldWrapChildren>
                <Tag colorScheme="alpha">{`$${marketcap.toLocaleString()} market cap`}</Tag>
                <Tag colorScheme="alpha">{`${holdersCount} holders`}</Tag>
              </Wrap>
            )}
          </Stack>
        </Stack>
      </Card>
    </Link>
  )
}

export default WrappedCard
