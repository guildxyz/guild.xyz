import {
  Center,
  Flex,
  GridItem,
  HStack,
  Icon,
  Img,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Button from "components/common/Button"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import {
  CurrencyCircleDollar,
  GithubLogo,
  ImageSquare,
  ListChecks,
  Plus,
  TwitterLogo,
  Wrench,
} from "phosphor-react"
import { RequirementType } from "types"

type RequirementButton = {
  icon: JSX.Element
  label: string
  type: RequirementType
  disabled?: boolean
}

const requirementButtons: {
  general: Array<RequirementButton>
  integrations: Array<RequirementButton>
} = {
  general: [
    {
      icon: <Icon as={CurrencyCircleDollar} boxSize={6} />,
      label: "Token",
      type: "ERC20",
    },
    {
      icon: <Icon as={ImageSquare} boxSize={6} />,
      label: "NFT",
      type: "ERC721",
    },
    {
      icon: <Icon as={ListChecks} boxSize={6} />,
      label: "Allowlist",
      type: "ALLOWLIST",
    },
    {
      icon: <Icon as={Wrench} boxSize={6} />,
      label: "Contract state",
      type: "CONTRACT",
    },
  ],
  integrations: [
    {
      icon: (
        <Center
          padding={1}
          backgroundColor="twitter.500"
          borderRadius="full"
          overflow={"hidden"}
        >
          <TwitterLogo />
        </Center>
      ),
      label: "Twitter",
      type: "TWITTER",
    },

    {
      icon: (
        <Center
          padding={1}
          backgroundColor="gray.500"
          borderRadius="full"
          overflow={"hidden"}
        >
          <GithubLogo />
        </Center>
      ),
      label: "GitHub",
      type: "GITHUB",
    },

    {
      icon: <Img src="/requirementLogos/unlock.png" boxSize={6} rounded="full" />,
      label: "Unlock",
      type: "UNLOCK",
    },
    {
      icon: <Img src="/requirementLogos/poap.svg" boxSize={6} />,
      label: "POAP",
      type: "POAP",
    },
    {
      icon: <Img src="/requirementLogos/gitpoap.svg" boxSize={6} />,
      label: "GitPOAP",
      type: "GITPOAP",
    },
    {
      icon: <Img src="/requirementLogos/mirror.svg" boxSize={6} />,
      label: "Mirror Edition",
      type: "MIRROR",
    },
    {
      icon: <Img src="/requirementLogos/juicebox.png" height={6} />,
      label: "Juicebox",
      type: "JUICEBOX",
    },
    {
      icon: <Img src="/requirementLogos/snapshot.jpg" boxSize={6} rounded="full" />,
      label: "Snapshot",
      type: "SNAPSHOT",
      disabled: true,
    },
    {
      icon: <Img src="/requirementLogos/galaxy.svg" boxSize={6} />,
      label: "Galxe",
      type: "GALAXY",
    },
    {
      icon: <Img src="/requirementLogos/noox.svg" boxSize={6} />,
      label: "Noox",
      type: "NOOX",
    },
    {
      icon: <Img src="/requirementLogos/lens.png" boxSize={6} />,
      label: "Lens",
      type: "LENS_PROFILE",
    },
    {
      icon: <Img src="/requirementLogos/otterspace.png" boxSize={6} />,
      label: "Otterspace",
      type: "OTTERSPACE",
    },
  ],
}

type Props = {
  initial: boolean
  onAdd: (type: RequirementType) => void
}

const AddRequirementCard = ({ initial, onAdd }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  const onClick = (type: RequirementType) => {
    onAdd(type)
  }

  const colSpan = (gridItems: number, currentIndex: number) =>
    (gridItems % 3 === 2 && gridItems - currentIndex <= 2) || gridItems === 4 ? 3 : 2

  const rightBorderWidth = (gridItems: number, currentIndex: number) => {
    if (gridItems === 4 && currentIndex % 2 === 0) return 1
    if (
      currentIndex === gridItems - 1 ||
      (currentIndex + 1) % 3 === 0 ||
      (gridItems === 4 && currentIndex % 2 !== 0)
    )
      return 0
    return 1
  }

  const topBorderWidth = (gridItems: number, currentIndex: number) => {
    if (gridItems === 4 && currentIndex === 2) return 1
    if (currentIndex < 3 || (gridItems === 4 && currentIndex < 2)) return 0
    return 1
  }

  return (
    <CardMotionWrapper>
      <Card
        minH={64}
        h="full"
        opacity={!initial && 0.4}
        _hover={{ opacity: 1 }}
        _focusWithin={{ opacity: 1 }}
        transition="0.2s"
      >
        <Tabs isFitted variant="unstyled" h="full">
          <TabList
            h={12}
            bgColor={colorMode === "light" ? "blackAlpha.200" : "blackAlpha.400"}
          >
            {Object.keys(requirementButtons).map((requirementCategory) => (
              <Tab
                key={requirementCategory}
                _selected={{
                  bgColor: colorMode === "light" ? "white" : "gray.700",
                }}
                pt={3}
                borderTopRadius="2xl"
                fontSize="sm"
                fontWeight="bold"
                textTransform="uppercase"
              >
                <HStack>
                  <Icon as={Plus} boxSize={4} />
                  <Text as="span">{requirementCategory}</Text>
                </HStack>
              </Tab>
            ))}
          </TabList>

          <TabPanels h="calc(100% - 3rem)">
            {Object.keys(requirementButtons).map((requirementCategory) => (
              <TabPanel key={requirementCategory} p={0} h="full">
                <Flex direction="column" h="full">
                  <SimpleGrid gridTemplateColumns="repeat(6, 1fr)" h="full">
                    {requirementButtons[requirementCategory].map(
                      (requirementButton: RequirementButton, index: number) => (
                        <GridItem
                          key={requirementButton.type}
                          colSpan={colSpan(
                            requirementButtons[requirementCategory].length,
                            index
                          )}
                          borderColor={
                            colorMode === "light" ? "gray.200" : "gray.600"
                          }
                          borderRightWidth={rightBorderWidth(
                            requirementButtons[requirementCategory].length,
                            index
                          )}
                          borderTopWidth={topBorderWidth(
                            requirementButtons[requirementCategory].length,
                            index
                          )}
                        >
                          <Tooltip
                            isDisabled={!requirementButton.disabled}
                            label="Temporarily unavailable"
                          >
                            <Button
                              variant="ghost"
                              p={0}
                              w="full"
                              minH={24}
                              h="full"
                              alignItems="center"
                              justifyContent="center"
                              rounded="none"
                              onClick={() => onClick(requirementButton.type)}
                              isDisabled={requirementButton.disabled}
                            >
                              <VStack>
                                {requirementButton.icon}
                                <Text
                                  as="span"
                                  fontSize="sm"
                                  textTransform="uppercase"
                                >
                                  {requirementButton.label}
                                </Text>
                              </VStack>
                            </Button>
                          </Tooltip>
                        </GridItem>
                      )
                    )}
                    {requirementButtons[requirementCategory].length % 3 === 1 &&
                      requirementButtons[requirementCategory].length !== 4 && (
                        <GridItem
                          colSpan={4}
                          borderColor={
                            colorMode === "light" ? "gray.200" : "gray.600"
                          }
                          borderTopWidth={1}
                        />
                      )}
                  </SimpleGrid>
                </Flex>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Card>
    </CardMotionWrapper>
  )
}

export default AddRequirementCard
