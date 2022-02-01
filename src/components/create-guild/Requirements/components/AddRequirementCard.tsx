import {
  Box,
  Button,
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
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { CurrencyCircleDollar, ListChecks, Plus } from "phosphor-react"
import { useState } from "react"
import Nft from "static/requirementIcons/nft.svg"
import { RequirementType } from "types"

type RequirementButton = {
  icon: JSX.Element
  label: string
  type: RequirementType
}

const requirementButtons: {
  general: Array<RequirementButton>
  integrations: Array<RequirementButton>
} = {
  general: [
    {
      icon: <Icon as={CurrencyCircleDollar} boxSize={6} />,
      label: "Hold a Token",
      type: "ERC20",
    },
    {
      icon: <Icon as={Nft} boxSize={6} />,
      label: "ERC721",
      type: "ERC721",
    },
    {
      icon: <Icon as={Nft} boxSize={6} />,
      label: "ERC1155",
      type: "ERC1155",
    },
    {
      icon: <Icon as={ListChecks} boxSize={6} />,
      label: "Add Whitelist",
      type: "WHITELIST",
    },
  ],
  integrations: [
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
      icon: <Img src="/requirementLogos/juicebox.png" height={6} />,
      label: "Juicebox",
      type: "JUICEBOX",
    },
    {
      icon: <Img src="/requirementLogos/snapshot.jpg" boxSize={6} rounded="full" />,
      label: "Snapshot Strategy",
      type: "SNAPSHOT",
    },
    {
      icon: <Img src="/requirementLogos/mirror.svg" boxSize={6} />,
      label: "Mirror Edition",
      type: "MIRROR",
    },
  ],
}

type Props = {
  initial: boolean
  onAdd: (type: RequirementType) => void
}

const AddRequirementCard = ({ initial, onAdd }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  const [showRequirements, setShowRequirements] = useState(initial)

  const onClick = (type: RequirementType) => {
    onAdd(type)
    setShowRequirements(false)
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
      {showRequirements ? (
        <Card minH={64} h="full">
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
      ) : (
        <Box
          as="button"
          _hover={{
            bg: colorMode === "light" ? "gray.100" : "whiteAlpha.50",
          }}
          px={{ base: 5, sm: 7 }}
          w="full"
          h="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="2xl"
          borderWidth={2}
          borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
          overflow="hidden"
          onClick={() => setShowRequirements(true)}
        >
          <VStack spacing={4} py={8}>
            <Icon
              as={Plus}
              boxSize={8}
              color={colorMode === "light" ? "gray.300" : "gray.500"}
            />
            <Text
              fontWeight="bold"
              color={colorMode === "light" ? "gray.400" : "gray.500"}
            >
              Add requirement
            </Text>
          </VStack>
        </Box>
      )}
    </CardMotionWrapper>
  )
}

export default AddRequirementCard
