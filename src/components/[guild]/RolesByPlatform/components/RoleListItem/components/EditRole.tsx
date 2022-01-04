import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Icon,
  IconButton,
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
import DeleteRoleCard from "components/[guild]/edit/[role]/DeleteRoleCard"
import useEditRole from "components/[guild]/edit/[role]/hooks/useEditRole"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { Check, PencilSimple } from "phosphor-react"
import { useRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Role } from "types"
import tryToParse from "utils/tryToParse"

type Props = {
  roleData: Role
}

const EditRole = ({ roleData }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const drawerSize = useBreakpointValue({ base: "full", md: "xl" })

  const { id, name, description, imageUrl, logic, requirements } = roleData

  const { onSubmit, isLoading, isImageLoading } = useEditRole(id)

  const methods = useForm({
    mode: "all",
    defaultValues: {
      name,
      description,
      imageUrl,
      logic,
      requirements: requirements?.map((requirement) => ({
        active: true,
        type: requirement.type,
        chain: requirement.chain,
        address:
          requirement.type === "COIN"
            ? "0x0000000000000000000000000000000000000000"
            : requirement.address,
        key: requirement.key,
        value: tryToParse(requirement.value),
      })),
    },
  })

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  return (
    <>
      <IconButton
        ref={btnRef}
        icon={<Icon as={PencilSimple} />}
        size="sm"
        rounded="full"
        aria-label="Edit role"
        onClick={onOpen}
      />

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
            Edit role
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

                <Section title="Requirements logic">
                  <LogicPicker />
                </Section>

                <Requirements maxCols={2} />

                <Divider
                  borderColor={colorMode === "light" ? "blackAlpha.400" : undefined}
                />

                <DeleteRoleCard />
              </VStack>
            </FormProvider>
          </DrawerBody>

          <DrawerFooter bgColor={colorMode === "light" ? "white" : "gray.800"}>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={isLoading || isImageLoading}
              colorScheme="green"
              onClick={methods.handleSubmit(onSubmit)}
              leftIcon={<Icon as={Check} />}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default EditRole
