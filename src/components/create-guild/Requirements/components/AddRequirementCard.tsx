import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { RequirementType } from "types"

type Props = {
  onAdd: (type: RequirementType) => void
}

const AddRequirementCard = ({ onAdd }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <CardMotionWrapper>
      <Card>
        <Tabs isFitted variant="unstyled">
          <TabList
            bgColor={colorMode === "light" ? "blackAlpha.100" : "blackAlpha.400"}
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
              General
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
              Integrations
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack width="full">
                <Button
                  variant="strongOutline"
                  width="full"
                  colorScheme="indigo"
                  onClick={() => onAdd("ERC20")}
                >
                  Hold a Token
                </Button>

                <Button
                  variant="strongOutline"
                  width="full"
                  colorScheme="green"
                  onClick={() => onAdd("ERC721")}
                >
                  Hold an NFT
                </Button>

                <Button
                  variant="strongOutline"
                  width="full"
                  colorScheme="white"
                  onClick={() => onAdd("WHITELIST")}
                >
                  Create whitelist
                </Button>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack width="full">
                <Button
                  variant="strongOutline"
                  width="full"
                  colorScheme="blue"
                  onClick={() => onAdd("POAP")}
                >
                  Hold a POAP
                </Button>

                <Button
                  variant="strongOutline"
                  width="full"
                  colorScheme="orange"
                  onClick={() => onAdd("SNAPSHOT")}
                >
                  Snapshot Strategy
                </Button>

                <Button
                  variant="strongOutline"
                  width="full"
                  colorScheme="gray"
                  onClick={() => onAdd("MIRROR")}
                >
                  Mirror Edition
                </Button>

                <Button
                  variant="strongOutline"
                  width="full"
                  colorScheme="salmon"
                  onClick={() => onAdd("UNLOCK")}
                >
                  Unlock
                </Button>

                <Button
                  variant="strongOutline"
                  width="full"
                  colorScheme="yellow"
                  onClick={() => onAdd("JUICEBOX")}
                >
                  Juicebox
                </Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Card>
    </CardMotionWrapper>
  )
}

export default AddRequirementCard
