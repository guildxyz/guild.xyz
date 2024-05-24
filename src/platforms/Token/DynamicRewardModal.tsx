import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  HStack,
  Heading,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import Card from "components/common/Card"
import dynamic from "next/dynamic"
import { Lightning, PencilSimple, Question } from "phosphor-react"
import { Requirement, RolePlatform } from "types"
import DynamicRewardCalculationTable from "./DynamicRewardCalculationTable"

const EditModalDynamic = dynamic(
  () => import("platforms/Token/EditDynamicRewardModal")
)

const LinkedRequirement = ({ requirement }: { requirement?: Requirement }) => (
  <Stack gap={0}>
    <HStack mb="3">
      <Heading fontSize="md">Linked to value</Heading>
      <Tooltip
        label="For dynamic rewards, the reward amount is calculated from a base value, originated from a requirement. "
        placement="bottom"
        hasArrow
      >
        <Icon as={Question} color="GrayText" />
      </Tooltip>
    </HStack>
    <Stack>
      {requirement !== undefined && (
        <Card px={4} py={2}>
          <RequirementDisplayComponent
            requirement={requirement as Requirement}
            dynamicDisplay
            rightElement={null}
          />
        </Card>
      )}
      {!requirement && (
        <Alert status="warning">
          <AlertIcon mt={0} /> This reward is not linked to any specific requirements
          and therefore it's amount will always be 0.
        </Alert>
      )}
    </Stack>
  </Stack>
)

const DynamicRewardModal = ({
  isOpen,
  onClose,
  linkedRequirement,
  rolePlatform,
}: {
  isOpen: boolean
  onClose: () => void
  linkedRequirement?: Requirement
  rolePlatform: RolePlatform
}) => {
  const { isAdmin } = useGuildPermission()

  const handleClose = () => {
    onClose()
  }

  const {
    isOpen: editIsOpen,
    onClose: editOnClose,
    onOpen: editOnOpen,
  } = useDisclosure()
  const footerBg = useColorModeValue("blackAlpha.100", "blackAlpha.600")

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size={"lg"} colorScheme={"dark"}>
        <ModalOverlay />
        <ModalContent>
          {isAdmin && (
            <IconButton
              position={"absolute"}
              icon={<PencilSimple size={18} weight="regular" />}
              aria-label="Edit dynamic parameters"
              rounded="full"
              right={16}
              top={7}
              size={"sm"}
              variant={"ghost"}
              onClick={() => {
                onClose()
                editOnOpen()
              }}
            />
          )}
          <ModalCloseButton />
          <ModalHeader>
            <Text>
              <Icon color="green.500" boxSize={4} weight="fill" as={Lightning} />{" "}
              Dynamic Reward
            </Text>
          </ModalHeader>

          <ModalBody>
            <Stack spacing={6}>
              <LinkedRequirement requirement={linkedRequirement} />
              <DynamicRewardCalculationTable
                requirement={linkedRequirement}
                rolePlatform={rolePlatform}
              />
            </Stack>
          </ModalBody>
          <ModalFooter pt={6} pb={6} bg={footerBg} border={"none"}>
            <Accordion allowToggle w="full">
              <AccordionItem border={"none"}>
                <AccordionButton
                  display={"flex"}
                  rounded={"lg"}
                  fontWeight={"semibold"}
                  px={0}
                  opacity={0.5}
                  _hover={{ opacity: 1 }}
                >
                  <Icon as={Question} mr={2} />
                  What's a dynamic reward?
                  <AccordionIcon ml={"auto"} />
                </AccordionButton>
                <AccordionPanel>
                  <Text color={"GrayText"}>
                    Dynamic rewards adjust the amount of rewards you can earn based
                    on various factors, like completing specific requirements,
                    accumulating points, or your activities within the guild.
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isAdmin && (
        <EditModalDynamic
          isOpen={editIsOpen}
          onClose={editOnClose}
          rolePlatform={rolePlatform}
        />
      )}
    </>
  )
}

export default DynamicRewardModal
