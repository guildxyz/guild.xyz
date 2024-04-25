import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Circle,
  Divider,
  FormControl,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import useEditRolePlatform from "components/[guild]/AccessHub/hooks/useEditRolePlatform"
import { AddTokenFormType } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/AddTokenPanel"
import ConversionInput from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/components/ConversionInput"
import CustomSnapshotForm from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/components/CustomSnapshotForm"
import { SnapshotOption } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/components/DynamicAmount"
import GuildPointsSnapshotForm from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/components/GuildPointsSnapshotForm"
import useGuild from "components/[guild]/hooks/useGuild"
import useRequirements from "components/[guild]/hooks/useRequirements"
import SnapshotModal from "components/[guild]/leaderboard/Snapshots/SnapshotModal"
import Button from "components/common/Button"
import RadioSelect from "components/common/RadioSelect"
import { Option } from "components/common/RadioSelect/RadioSelect"
import { SectionTitle } from "components/common/Section"
import useEditRequirement from "components/create-guild/Requirements/hooks/useEditRequirement"
import { mutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import useToast from "hooks/useToast"
import { ArrowSquareIn, ListNumbers } from "phosphor-react"
import { useTokenRewardContext } from "platforms/Token/TokenRewardContext"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import Star from "static/icons/star.svg"
import { Requirement } from "types"
import useRolePlatforms from "./hooks/useRolePlatforms"

const EditTokenModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const {
    guildPlatform: { id },
  } = useTokenRewardContext()

  const [changeSnapshot, setChangeSnapshot] = useState(false)

  const circleBgColor = useColorModeValue("blackAlpha.200", "gray.600")
  const [snapshotOption, setSnapshotOption] = useState(SnapshotOption.GUILD_POINTS)

  const dynamicOptions: Option[] = [
    {
      value: SnapshotOption.GUILD_POINTS,
      title: "Guild points snapshot",
      description:
        "Calculate rewards based on users' Guild points at a specific time",
      leftComponent: (
        <Circle bg={circleBgColor} p={3}>
          <Icon as={Star} />
        </Circle>
      ),
      children: <GuildPointsSnapshotForm />,
    },
    {
      value: SnapshotOption.CUSTOM,
      title: "Custom snapshot",
      description:
        "Upload a custom snapshot to assign unique numbers to users for reward calculation",
      leftComponent: (
        <Circle bg={circleBgColor} p={3}>
          <Icon as={ListNumbers} />
        </Circle>
      ),
      children: <CustomSnapshotForm />,
    },
  ]

  const methods = useForm<AddTokenFormType>({
    mode: "all",
  })

  const { setValue } = methods

  const { roles, id: guildId } = useGuild()

  const rolePlatforms = useRolePlatforms(id)

  const role = roles.find((rl) =>
    rl.rolePlatforms.find((rp) => rp.id === rolePlatforms[0].id)
  )
  const { data: requirements } = useRequirements(role.id)
  const snapshotRequirement = requirements?.find((req) => !!req?.data?.snapshot)

  useEffect(() => {
    const rp: any = rolePlatforms[0]
    const multiplier = rp.dynamicAmount.operation.params.multiplier || 1
    setValue("multiplier", multiplier)
  }, [rolePlatforms, setValue])

  const {
    isOpen: snapshotIsOpen,
    onOpen: snapshotOnOpen,
    onClose: snapshotOnClose,
  } = useDisclosure()

  const toast = useToast()

  const { onSubmit: submitEditRolePlatform, isLoading: rpIsLoading } =
    useEditRolePlatform({
      rolePlatformId: rolePlatforms[0].id,
      onSuccess: () => {
        toast({
          status: "success",
          title: "Successfully updated the conversion rate!",
        })
      },
    })

  const { onSubmit: submitEditRequirement, isLoading: reqIsLoading } =
    useEditRequirement(role.id, {
      onSuccess: () => {
        toast({
          status: "success",
          title: "Successfully changed the snapshot!",
        })
      },
    })

  const { mutateGuild } = useGuild()

  const onEditSubmit = async (data) => {
    // Update conversion
    const modifiedRolePlatform: any = { ...rolePlatforms[0] }
    modifiedRolePlatform.dynamicAmount.operation.params.multiplier = data.multiplier
    await submitEditRolePlatform(modifiedRolePlatform)

    if (!changeSnapshot || !data?.requirements?.[0]?.data) {
      mutateGuild()
      onClose()
      return
    }

    const req = await submitEditRequirement({
      ...snapshotRequirement,
      data: data.requirements[0].data,
    })

    onClose()
    mutateOptionalAuthSWRKey<Requirement[]>(
      `/v2/guilds/${guildId}/roles/${role.id}/requirements`,
      (prevRequirements) => [
        ...prevRequirements.filter((r) => r.type === "FREE"),
        req,
      ],
      { revalidate: false }
    )
    mutateGuild()
    return
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Text>Edit token reward</Text>
          </ModalHeader>

          <ModalBody>
            <FormProvider {...methods}>
              <Stack gap={6}>
                <Stack>
                  <SectionTitle title={"Snapshot"} />
                  <Text colorScheme="gray">
                    Change the snapshot that the reward amount is based on.
                  </Text>
                  <Button
                    rightIcon={<ArrowSquareIn />}
                    variant="outline"
                    onClick={snapshotOnOpen}
                  >
                    View current snapshot
                  </Button>

                  <Accordion
                    defaultIndex={changeSnapshot ? [0] : []}
                    allowToggle
                    onChange={() => setChangeSnapshot(!changeSnapshot)}
                  >
                    <AccordionItem border={"none"}>
                      <AccordionButton p={0}>
                        <Button
                          w="full"
                          colorScheme={changeSnapshot ? "indigo" : "gray"}
                          rightIcon={<AccordionIcon />}
                        >
                          <HStack>
                            <Text>Change snapshot</Text>
                          </HStack>
                        </Button>
                      </AccordionButton>

                      <AccordionPanel p={0} mt={2}>
                        <FormControl>
                          <RadioSelect
                            options={dynamicOptions}
                            colorScheme="primary"
                            onChange={(val) => {
                              setSnapshotOption(SnapshotOption[val])
                              if (val === SnapshotOption.CUSTOM)
                                setValue("data.guildPlatformId", null)
                            }}
                            value={snapshotOption.toString()}
                          />
                        </FormControl>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Stack>
                <Divider />
                <Stack gap={0}>
                  <SectionTitle title={"Change conversion"} mb={2} />
                  <ConversionInput />
                </Stack>

                <Button
                  isLoading={rpIsLoading || reqIsLoading}
                  loadingText={
                    rpIsLoading
                      ? "Updating the conversion rate..."
                      : reqIsLoading
                      ? "Updating the snapshot..."
                      : "Saving..."
                  }
                  size="lg"
                  width="fill"
                  colorScheme="indigo"
                  onClick={methods.handleSubmit(onEditSubmit)}
                >
                  Save
                </Button>
              </Stack>
            </FormProvider>
          </ModalBody>
        </ModalContent>
      </Modal>

      {snapshotRequirement && (
        <SnapshotModal
          onClose={snapshotOnClose}
          isOpen={snapshotIsOpen}
          snapshotRequirement={snapshotRequirement}
        />
      )}
    </>
  )
}

export default EditTokenModal
