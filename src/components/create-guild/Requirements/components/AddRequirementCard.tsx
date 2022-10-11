import {
  Heading,
  Icon,
  Img,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import Button from "components/common/Button"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { Modal } from "components/common/Modal"
import {
  CaretRight,
  CurrencyCircleDollar,
  ImageSquare,
  ListChecks,
  Wrench,
} from "phosphor-react"
import { FC } from "react"
import { RequirementType } from "types"

type RequirementButton = {
  icon: FC | string
  label: string
  type: RequirementType
  color?: string
  disabled?: boolean
}

const general: Array<RequirementButton> = [
  {
    icon: CurrencyCircleDollar,
    label: "Token",
    type: "ERC20",
  },
  {
    icon: ImageSquare,
    label: "NFT",
    type: "ERC721",
  },
  {
    icon: ListChecks,
    label: "Allowlist",
    type: "ALLOWLIST",
  },
  {
    icon: Wrench,
    label: "Custom contract query",
    type: "CONTRACT",
  },
]

const integrations: Array<RequirementButton> = [
  {
    icon: "/requirementLogos/twitter.svg",
    label: "Twitter",
    type: "TWITTER",
  },

  {
    icon: "/platforms/github.png",
    label: "GitHub",
    type: "GITHUB",
  },

  {
    icon: "/requirementLogos/unlock.png",
    label: "Unlock",
    type: "UNLOCK",
  },
  {
    icon: "/requirementLogos/poap.svg",
    label: "POAP",
    type: "POAP",
  },
  {
    icon: "/requirementLogos/gitpoap.svg",
    label: "GitPOAP",
    type: "GITPOAP",
  },
  {
    icon: "/requirementLogos/mirror.svg",
    label: "Mirror Edition",
    type: "MIRROR",
  },
  {
    icon: "/requirementLogos/juicebox.png",
    label: "Juicebox",
    type: "JUICEBOX",
  },
  {
    icon: "/requirementLogos/snapshot.png",
    label: "Snapshot",
    type: "SNAPSHOT",
    disabled: true,
  },
  {
    icon: "/requirementLogos/galaxy.svg",
    label: "Galxe",
    type: "GALAXY",
  },
  {
    icon: "/requirementLogos/noox.svg",
    label: "Noox",
    type: "NOOX",
  },
  {
    icon: "/requirementLogos/lens.png",
    label: "Lens",
    type: "LENS_PROFILE",
  },
]

type Props = {
  initial: boolean
  onAdd: (type: RequirementType) => void
}

const AddRequirementCard = ({ initial, onAdd }: Props): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onClick = (type: RequirementType) => {
    onAdd(type)
    onClose()
  }

  return (
    <>
      <CardMotionWrapper>
        <AddCard text="Add requirement" onClick={onOpen} minH="44" />
      </CardMotionWrapper>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        // colorScheme={"dark"}
      >
        <ModalOverlay />
        <ModalContent height={{ md: "70%" }}>
          <ModalCloseButton />
          <ModalHeader>Add requirement</ModalHeader>
          <ModalBody>
            <Heading size="sm" mb="3">
              General
            </Heading>
            <SimpleGrid columns={2} gap="2">
              {general.map((requirementButton: RequirementButton, index: number) => (
                <Button
                  key={requirementButton.type}
                  minH={24}
                  onClick={() => onClick(requirementButton.type)}
                  isDisabled={requirementButton.disabled}
                >
                  <VStack w="full" whiteSpace={"break-spaces"}>
                    <Icon as={requirementButton.icon as FC} boxSize={6} />
                    <Text as="span">{requirementButton.label}</Text>
                  </VStack>
                </Button>
              ))}
            </SimpleGrid>
            <Heading size="sm" mb="3" mt="8">
              Integrations
            </Heading>
            <Stack>
              {integrations.map(
                (requirementButton: RequirementButton, index: number) => (
                  <Tooltip
                    key={requirementButton.type}
                    isDisabled={!requirementButton.disabled}
                    label="Temporarily unavailable"
                    hasArrow
                  >
                    <Button
                      py="8"
                      px="6"
                      leftIcon={
                        <Img src={requirementButton.icon as string} boxSize="6" />
                      }
                      rightIcon={<Icon as={CaretRight} />}
                      iconSpacing={4}
                      onClick={() => onClick(requirementButton.type)}
                      isDisabled={requirementButton.disabled}
                      sx={{ ".chakra-text": { w: "full", textAlign: "left" } }}
                    >
                      {requirementButton.label}
                    </Button>
                  </Tooltip>
                )
              )}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddRequirementCard
