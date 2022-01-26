import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
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

const AddRequirementCard2 = ({ onAdd }: Props): JSX.Element => {
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
                <VStack width="full" spacing={0} divider={<Divider />}>
                  <Button
                    variant="ghost"
                    colorScheme="indigo"
                    rounded="none"
                    w="full"
                    justifyContent="space-between"
                    leftIcon={<Icon as={CurrencyCircleDollar} boxSize={6} />}
                    onClick={() => onAdd("ERC20")}
                  >
                    Hold a Token
                  </Button>

                  <Button
                    variant="ghost"
                    colorScheme="green"
                    rounded="none"
                    w="full"
                    justifyContent="space-between"
                    leftIcon={<Icon as={Nft} boxSize={6} />}
                    onClick={() => onAdd("ERC721")}
                  >
                    Hold an NFT
                  </Button>

                  <Button
                    variant="ghost"
                    rounded="none"
                    w="full"
                    justifyContent="space-between"
                    leftIcon={<Icon as={ListChecks} boxSize={6} />}
                    onClick={() => onAdd("WHITELIST")}
                  >
                    Create a whitelist
                  </Button>
                </VStack>
              </TabPanel>
              <TabPanel p={0}>
                <VStack width="full" spacing={0} divider={<Divider />}>
                  <Button
                    variant="ghost"
                    colorScheme="blue"
                    rounded="none"
                    w="full"
                    onClick={() => onAdd("POAP")}
                  >
                    Hold a POAP
                  </Button>

                  <Button
                    variant="ghost"
                    colorScheme="orange"
                    rounded="none"
                    w="full"
                    onClick={() => onAdd("SNAPSHOT")}
                  >
                    Snapshot Strategy
                  </Button>

                  <Button
                    variant="ghost"
                    rounded="none"
                    w="full"
                    onClick={() => onAdd("MIRROR")}
                  >
                    Mirror Edition
                  </Button>

                  <Button
                    variant="ghost"
                    colorScheme="salmon"
                    rounded="none"
                    w="full"
                    onClick={() => onAdd("UNLOCK")}
                  >
                    Unlock
                  </Button>

                  <Button
                    variant="ghost"
                    colorScheme="yellow"
                    rounded="none"
                    w="full"
                    onClick={() => onAdd("JUICEBOX")}
                  >
                    Juicebox
                  </Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Card>
      </Box>
    </CardMotionWrapper>
  )
}

export default AddRequirementCard2
