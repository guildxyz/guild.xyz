import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Divider,
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
  useDisclosure,
} from "@chakra-ui/react"
import useEditRolePlatform from "components/[guild]/AccessHub/hooks/useEditRolePlatform"
import useMembershipUpdate from "components/[guild]/JoinModal/hooks/useMembershipUpdate"
import { AddTokenFormType } from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/AddTokenPanel"
import ConversionInput from "components/[guild]/RolePlatforms/components/AddRoleRewardModal/components/AddTokenPanel/components/ConversionInput"
import useGuild from "components/[guild]/hooks/useGuild"
import useGuildPlatform from "components/[guild]/hooks/useGuildPlatform"
import useRequirements from "components/[guild]/hooks/useRequirements"
import SnapshotModal from "components/[guild]/leaderboard/Snapshots/SnapshotModal"
import { usePostHogContext } from "components/_app/PostHogProvider"
import Button from "components/common/Button"
import { SectionTitle } from "components/common/Section"
import OptionImage from "components/common/StyledSelect/components/CustomSelectOption/components/OptionImage"
import { useCreateRequirementForRole } from "components/create-guild/Requirements/hooks/useCreateRequirement"
import useEditRequirement from "components/create-guild/Requirements/hooks/useEditRequirement"
import { mutateOptionalAuthSWRKey } from "hooks/useSWRWithOptionalAuth"
import useShowErrorToast from "hooks/useShowErrorToast"
import useToast from "hooks/useToast"
import { Star } from "phosphor-react"
import { useTokenRewardContext } from "platforms/Token/TokenRewardContext"
import { ReactNode, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import Token from "static/icons/token.svg"
import { Requirement } from "types"
import DynamicTypeForm from "./DynamicTypeForm"
import useRolePlatformsOfReward from "./hooks/useRolePlatformsOfReward"

const EditTokenModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const {
    token: {
      data: { symbol },
    },
    guildPlatform: { id },
    imageUrl,
  } = useTokenRewardContext()

  const [changeSnapshot, setChangeSnapshot] = useState(false)

  const methods = useForm<AddTokenFormType>({
    mode: "all",
  })

  const { roles, id: guildId, urlName } = useGuild()

  const rolePlatforms = useRolePlatformsOfReward(id)

  const role = roles.find((rl) =>
    rl.rolePlatforms.find((rp) => rp.id === rolePlatforms?.[0]?.id)
  )
  const { data: requirements } = useRequirements(role?.id)
  const snapshotRequirement = requirements?.find((req) => !!req?.data?.snapshot)
  const pointsPlatformId: number = snapshotRequirement?.data?.guildPlatformId

  const { guildPlatform: selectedPointsPlatform } =
    useGuildPlatform(pointsPlatformId)

  const pointsPlatformImage: ReactNode = selectedPointsPlatform?.platformGuildData
    ?.imageUrl ? (
    <OptionImage
      img={selectedPointsPlatform?.platformGuildData?.imageUrl}
      alt={selectedPointsPlatform?.platformGuildData?.name ?? "Point type image"}
    />
  ) : (
    <Icon as={Star} />
  )

  const { captureEvent } = usePostHogContext()
  const postHogOptions = {
    guild: urlName,
    guildPlatformId: id,
  }

  const multiplier = useMemo(() => {
    const rp: any = rolePlatforms?.[0]
    return rp ? rp.dynamicAmount.operation.params.multiplier : 1.0
  }, [rolePlatforms])

  const {
    isOpen: snapshotIsOpen,
    onOpen: snapshotOnOpen,
    onClose: snapshotOnClose,
  } = useDisclosure()

  const toast = useToast()
  const showErrorToast = useShowErrorToast()

  const { onSubmit: submitEditRolePlatform, isLoading: rpIsLoading } =
    useEditRolePlatform({
      rolePlatformId: rolePlatforms?.[0]?.id,
      onSuccess: () => {
        captureEvent("editToken(EditRolePlatform) Updated role platform", {
          ...postHogOptions,
          rolePlatformId: rolePlatforms?.[0]?.id,
        })
        toast({
          status: "success",
          title: "Successfully updated the conversion rate!",
        })
      },
    })

  const { onSubmit: submitEditRequirement, isLoading: reqIsLoading } =
    useEditRequirement(role?.id, {
      onSuccess: () => {
        captureEvent("editToken(EditRequirement) Updated requirement", {
          ...postHogOptions,
          roleId: role?.id,
        })
        toast({
          status: "success",
          title: "Successfully changed the snapshot!",
        })
      },
    })

  const { onSubmit: onRequirementSubmit } = useCreateRequirementForRole()

  const { mutateGuild } = useGuild()

  const mutateRequirements = (
    req: Requirement,
    roleId: number,
    idForGuild: number
  ) => {
    mutateOptionalAuthSWRKey<Requirement[]>(
      `/v2/guilds/${idForGuild}/roles/${roleId}/requirements`,
      (prevRequirements) => [
        ...prevRequirements.filter((r) => r.type === "FREE"),
        req,
      ],
      { revalidate: false }
    )
  }

  const { triggerMembershipUpdate } = useMembershipUpdate()

  const onEditSubmit = async (data) => {
    const modifiedRolePlatform: any = { ...rolePlatforms?.[0] }

    // Create new snapshot if currently does not exist
    if (!snapshotRequirement) {
      await onRequirementSubmit({
        requirement: data.requirements[0] as Requirement,
        roleId: role.id,
        onSuccess: (req) => {
          toast({
            status: "success",
            title: "Snapshot successfully added!",
          })

          captureEvent("editToken(CreateRequirement) Requirement created", {
            ...postHogOptions,
            requirementId: req.id,
          })

          modifiedRolePlatform.dynamicAmount.operation.input[0].requirementId =
            req.id
          mutateRequirements(req, role.id, guildId)
          triggerMembershipUpdate()
        },
        onError: (err) => {
          showErrorToast("Failed to create snapshot requirement!")
          captureEvent(
            "editToken(CreateRequirement) Failed to create snapshot requirement",
            { ...postHogOptions, err }
          )
          console.error(err)
        },
      })
    }

    // Update conversion
    modifiedRolePlatform.dynamicAmount.operation.params.multiplier = data.multiplier
    await submitEditRolePlatform(modifiedRolePlatform)

    if (!changeSnapshot || !data?.requirements?.[0]?.data || !snapshotRequirement) {
      mutateGuild()
      onClose()
      return
    }

    const req = await submitEditRequirement({
      ...snapshotRequirement,
      data: data.requirements[0].data,
    })

    onClose()
    mutateRequirements(req, role.id, guildId)
    mutateGuild()
    triggerMembershipUpdate()
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
                  {snapshotRequirement && (
                    <Button variant="outline" onClick={snapshotOnOpen}>
                      View current snapshot
                    </Button>
                  )}

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
                            <Text>
                              {snapshotRequirement ? "Change" : "Set"} snapshot
                            </Text>
                          </HStack>
                        </Button>
                      </AccordionButton>

                      <AccordionPanel p={0} mt={2}>
                        <DynamicTypeForm />
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Stack>
                <Divider />
                <Stack gap={0}>
                  <SectionTitle title={"Change conversion"} mb={2} />
                  <ConversionInput
                    name="multiplier"
                    toImage={
                      imageUrl ? (
                        <OptionImage img={imageUrl} alt={symbol} />
                      ) : (
                        <Token />
                      )
                    }
                    fromImage={pointsPlatformImage}
                    defaultMultiplier={multiplier}
                  />
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
                  colorScheme="green"
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
