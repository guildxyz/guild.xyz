import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  MenuItem,
  useBreakpointValue,
  useColorMode,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import Section from "components/common/Section"
import Description from "components/create-guild/Description"
import LogicPicker from "components/create-guild/LogicPicker"
import NameAndIcon from "components/create-guild/NameAndIcon"
import Requirements from "components/create-guild/Requirements"
import useEdit from "components/[guild]/EditButtonGroup/components/CustomizationButton/hooks/useEdit"
import usePersonalSign from "hooks/usePersonalSign"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { GearSix } from "phosphor-react"
import { useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Guild } from "types"
import tryToParse from "utils/tryToParse"

type Props = {
  guild: Guild
}

const EditGuildButton = ({ guild }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const drawerSize = useBreakpointValue({ base: "full", md: "xl" })

  const { isSigning } = usePersonalSign()
  const { onSubmit, isLoading, isImageLoading, response } = useEdit()

  const loadingText = (): string => {
    if (isSigning) return "Check your wallet"
    if (isImageLoading) return "Uploading image"
    return "Saving data"
  }

  const methods = useForm({
    mode: "all",
    defaultValues:
      guild.platforms[0]?.roles?.length > 1
        ? {
            name: guild.name,
            imageUrl: guild.imageUrl,
            description: guild.description,
          }
        : {
            // When we have only 1 role in a guild, we can edit that role instead of the guild
            name: guild.name,
            imageUrl: guild.imageUrl,
            description: guild.description,
            logic: guild.platforms[0]?.roles?.[0].logic,
            requirements: guild.platforms[0]?.roles?.[0].requirements?.map(
              (requirement) => ({
                active: true,
                type: requirement.type,
                chain: requirement.chain,
                address:
                  requirement.type === "COIN"
                    ? "0x0000000000000000000000000000000000000000"
                    : requirement.address,
                key: requirement.key,
                value: tryToParse(requirement.value),
              })
            ),
          },
  })

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  return (
    <>
      <MenuItem py="2" cursor="pointer" onClick={onOpen} icon={<GearSix />}>
        Edit guild
      </MenuItem>

      <Drawer
        isOpen={isOpen}
        placement="left"
        size={drawerSize}
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton rounded="full" />
          <DrawerHeader
            bgColor={colorMode === "light" ? "white" : "gray.800"}
            fontFamily="display"
            fontWeight="black"
            fontSize="4xl"
          >
            Edit guild
          </DrawerHeader>

          <DrawerBody
            bgColor={colorMode === "light" ? "white" : "gray.800"}
            className="custom-scrollbar"
          >
            <FormProvider {...methods}>
              <VStack spacing={10} alignItems="start">
                <Section title="Choose a logo and name for your role">
                  <NameAndIcon />
                </Section>

                <Section title="Role description">
                  <Description />
                </Section>

                {!(guild?.platforms?.[0].roles?.length > 1) && (
                  <>
                    <Section title="Requirements logic">
                      <LogicPicker />
                    </Section>

                    <Requirements maxCols={2} />
                  </>
                )}
              </VStack>
            </FormProvider>
          </DrawerBody>

          <DrawerFooter bgColor={colorMode === "light" ? "white" : "gray.800"}>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={isLoading || isImageLoading || isSigning || !!response}
              isLoading={isLoading || isImageLoading || isSigning}
              colorScheme="green"
              loadingText={loadingText()}
              onClick={methods.handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default EditGuildButton
