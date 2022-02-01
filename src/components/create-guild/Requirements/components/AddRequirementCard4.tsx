import { Box, Button, Icon, Img, Text, useColorMode, VStack } from "@chakra-ui/react"
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
  General: Array<RequirementButton>
  Integrations: Array<RequirementButton>
} = {
  General: [
    {
      icon: <Icon as={CurrencyCircleDollar} boxSize={6} />,
      label: "Hold a Token",
      type: "ERC20",
    },
    {
      icon: <Icon as={Nft} boxSize={6} />,
      label: "Hold an NFT",
      type: "ERC721",
    },
    {
      icon: <Icon as={ListChecks} boxSize={6} />,
      label: "Create a Whitelist",
      type: "WHITELIST",
    },
  ],
  Integrations: [
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
      icon: <Img src="/requirementLogos/juicebox.png" height={6} ml={1} />,
      label: "Juicebox",
      type: "JUICEBOX",
    },
  ],
}

type Props = {
  initial: boolean
  onAdd: (type: RequirementType) => void
}

const AddRequirementCard4 = ({ initial, onAdd }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  const [showRequirements, setShowRequirements] = useState(initial)

  const onClick = (type: RequirementType) => {
    onAdd(type)
    setShowRequirements(false)
  }

  return (
    <Box
      position="relative"
      minH={48}
      borderRadius="2xl"
      borderWidth={2}
      borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
      cursor="pointer"
      overflow="hidden"
      _before={
        !initial &&
        showRequirements && {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          width: "calc(100% - 8px)",
          height: 6,
          bg: `linear-gradient(to top, transparent, ${
            colorMode === "light"
              ? "var(--chakra-colors-white)"
              : "var(--chakra-colors-gray-800)"
          })`,
          zIndex: 1001,
          pointerEvents: "none",
        }
      }
      _after={
        !initial &&
        showRequirements && {
          content: '""',
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "calc(100% - 8px)",
          height: 10,
          bg: `linear-gradient(to bottom, transparent, ${
            colorMode === "light"
              ? "var(--chakra-colors-white)"
              : "var(--chakra-colors-gray-800)"
          })`,
          pointerEvents: "none",
        }
      }
    >
      {showRequirements ? (
        <Box
          position={initial ? "relative" : "absolute"}
          inset={initial ? undefined : 0}
          width="full"
          overflowY="auto"
          className="custom-scrollbar"
        >
          <VStack spacing={4} w="full" py={2}>
            {Object.keys(requirementButtons).map((requirementCategory) => (
              <VStack
                key={requirementCategory}
                spacing={0}
                w="full"
                alignItems="start"
              >
                <Text
                  px={4}
                  py={2}
                  as="span"
                  textTransform="uppercase"
                  fontWeight="bold"
                >
                  {requirementCategory}
                </Text>
                {requirementButtons[requirementCategory].map((req) => (
                  <Button
                    key={req.type}
                    onClick={() => onClick(req.type)}
                    leftIcon={req.icon}
                    variant="ghost"
                    justifyContent="space-between"
                    width="full"
                    borderRadius={0}
                    borderBottomWidth={1}
                    _last={{
                      borderBottomWidth: 0,
                    }}
                  >
                    {req.label}
                  </Button>
                ))}
              </VStack>
            ))}
          </VStack>
        </Box>
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
    </Box>
  )
}

export default AddRequirementCard4
