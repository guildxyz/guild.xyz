import {
  FormControl,
  FormLabel,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useDisclosure,
  useRadioGroup,
} from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import { Modal } from "components/common/Modal"
import LogicDivider from "components/[guild]/LogicDivider"
import { useController, useFormContext } from "react-hook-form"
import PhotoUploader from "./components/PhotoUploader"
import SelectorButton from "./components/SelectorButton"

const getRandomInt = (max) => Math.floor(Math.random() * max)

const IconSelector = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { control, getValues, setValue } = useFormContext()

  const defaultIcon = getValues("imageUrl")

  const { field } = useController({
    control,
    name: "imageUrl",
    defaultValue: defaultIcon || `/guildLogos/${getRandomInt(286)}.svg`,
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "imageUrl",
    onChange: (e) => {
      field.onChange(e)
      setValue("customImage", "")
      onClose()
    },
    value: field.value,
  })

  const group = getRootProps()

  return (
    <>
      <IconButton
        autoFocus
        onClick={onOpen}
        rounded="full"
        boxSize={12}
        flexShrink={0}
        colorScheme="gray"
        icon={<GuildLogo imageUrl={field.value} bgColor="transparent" />}
        aria-label="Guild logo"
        variant="outline"
        border="1px"
        bg="blackAlpha.300"
      />
      <Modal {...{ isOpen, onClose }} size="3xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose logo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <PhotoUploader closeModal={onClose} />
            <LogicDivider logic="OR" px="0" my="5" />
            <FormControl>
              <FormLabel>Choose from default icons</FormLabel>
              <SimpleGrid
                minChildWidth="var(--chakra-sizes-10)"
                spacing="4"
                {...group}
              >
                {[...Array(285).keys()].map((i) => {
                  const radio = getRadioProps({
                    value: `/guildLogos/${i}.svg`,
                  })
                  return <SelectorButton key={i} {...radio} />
                })}
              </SimpleGrid>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default IconSelector
