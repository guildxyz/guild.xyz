import {
  Box,
  Button,
  HStack,
  Icon,
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
import Nft from "static/requirementIcons/nft.svg"
import { RequirementType } from "types"

type Props = {
  onAdd: (type: RequirementType) => void
}

const AddRequirementCard3 = ({ onAdd }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <CardMotionWrapper>
      <Box maxHeight="max-content">
        <Card>
          <Tabs isFitted variant="unstyled">
            <TabList
              bgColor={colorMode === "light" ? "blackAlpha.200" : "blackAlpha.400"}
            >
              <Tab
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
                  <Text as="span">General</Text>
                </HStack>
              </Tab>
              <Tab
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
                  <Text as="span">Integrations</Text>
                </HStack>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0}>
                <SimpleGrid gridTemplateColumns="repeat(3, 1fr)">
                  <Button
                    variant="ghost"
                    colorScheme="indigo"
                    py={6}
                    w="full"
                    h="auto"
                    rounded="none"
                    borderRightColor="gray.600"
                    borderRightWidth={1}
                    onClick={() => onAdd("ERC20")}
                  >
                    <VStack>
                      <Icon as={CurrencyCircleDollar} boxSize={6} />
                      <Text as="span" fontSize="sm" textTransform="uppercase">
                        Hold a Token
                      </Text>
                    </VStack>
                  </Button>

                  <Button
                    variant="ghost"
                    colorScheme="green"
                    py={6}
                    w="full"
                    h="auto"
                    rounded="none"
                    borderRightColor="gray.600"
                    borderRightWidth={1}
                    onClick={() => onAdd("ERC721")}
                  >
                    <VStack>
                      <Icon as={Nft} boxSize={6} />
                      <Text as="span" fontSize="sm" textTransform="uppercase">
                        Hold an NFT
                      </Text>
                    </VStack>
                  </Button>

                  <Button
                    variant="ghost"
                    py={6}
                    w="full"
                    h="auto"
                    rounded="none"
                    onClick={() => onAdd("WHITELIST")}
                  >
                    <VStack>
                      <Icon as={ListChecks} boxSize={6} />
                      <Text as="span" fontSize="sm" textTransform="uppercase">
                        Add whitelist
                      </Text>
                    </VStack>
                  </Button>
                </SimpleGrid>
              </TabPanel>
              <TabPanel p={0}>
                <SimpleGrid
                  gridTemplateColumns="repeat(2, 1fr)"
                  borderBottomColor="gray.600"
                  borderBottomWidth={1}
                >
                  <Button
                    variant="ghost"
                    colorScheme="orange"
                    py={6}
                    w="full"
                    h="auto"
                    rounded="none"
                    borderRightColor="gray.600"
                    borderRightWidth={1}
                    onClick={() => onAdd("SNAPSHOT")}
                  >
                    <VStack>
                      <Icon as={Nft} boxSize={6} />
                      <Text as="span" fontSize="sm" textTransform="uppercase">
                        Snapshot Strategy
                      </Text>
                    </VStack>
                  </Button>

                  <Button
                    variant="ghost"
                    py={6}
                    w="full"
                    h="auto"
                    rounded="none"
                    onClick={() => onAdd("MIRROR")}
                  >
                    <VStack>
                      <Icon as={Nft} boxSize={6} />
                      <Text as="span" fontSize="sm" textTransform="uppercase">
                        Mirror edition
                      </Text>
                    </VStack>
                  </Button>
                </SimpleGrid>

                <SimpleGrid gridTemplateColumns="repeat(3, 1fr)">
                  <Button
                    variant="ghost"
                    colorScheme="salmon"
                    py={6}
                    w="full"
                    h="auto"
                    rounded="none"
                    borderRightColor="gray.600"
                    borderRightWidth={1}
                    onClick={() => onAdd("UNLOCK")}
                  >
                    <VStack>
                      <Icon as={Nft} boxSize={6} />
                      <Text as="span" fontSize="sm" textTransform="uppercase">
                        Unlock
                      </Text>
                    </VStack>
                  </Button>

                  <Button
                    variant="ghost"
                    colorScheme="blue"
                    py={6}
                    w="full"
                    h="auto"
                    rounded="none"
                    borderRightColor="gray.600"
                    borderRightWidth={1}
                    onClick={() => onAdd("POAP")}
                  >
                    <VStack>
                      <Icon as={Nft} boxSize={6} />
                      <Text as="span" fontSize="sm" textTransform="uppercase">
                        POAP
                      </Text>
                    </VStack>
                  </Button>

                  <Button
                    variant="ghost"
                    colorScheme="yellow"
                    py={6}
                    w="full"
                    h="auto"
                    rounded="none"
                    onClick={() => onAdd("JUICEBOX")}
                  >
                    <VStack>
                      <Icon as={Nft} boxSize={6} />
                      <Text as="span" fontSize="sm" textTransform="uppercase">
                        Juicebox
                      </Text>
                    </VStack>
                  </Button>
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Card>
      </Box>
    </CardMotionWrapper>
  )
}

export default AddRequirementCard3
