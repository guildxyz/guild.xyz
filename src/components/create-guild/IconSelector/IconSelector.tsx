import {
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
import Modal from "components/common/Modal"
import { useController, useFormContext } from "react-hook-form"
import SelectorButton from "./components/SelectorButton"

const getRandomInt = (max) => Math.floor(Math.random() * max)

const IconSelector = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { control } = useFormContext()

  const { field } = useController({
    control,
    name: "imageUrl",
    defaultValue: `/guildLogos/${getRandomInt(286)}.svg`,
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "imageUrl",
    onChange: (e) => {
      field.onChange(e)
      onClose()
    },
    value: field.value,
  })

  const group = getRootProps()

  return (
    <>
      <IconButton
        onClick={onOpen}
        variant="ghost"
        borderRadius="0"
        borderLeftRadius="10px"
        w="12"
        ml="1px"
        icon={<img src={field.value} />}
        aria-label="Guild logo"
      />
      <Modal {...{ isOpen, onClose }} size="3xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose icon</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default IconSelector
