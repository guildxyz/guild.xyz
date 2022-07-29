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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
  useRadioGroup,
} from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import { Modal } from "components/common/Modal"
import LogicDivider from "components/[guild]/LogicDivider"
import { Uploader } from "hooks/usePinata/usePinata"
import React, { useEffect } from "react"
import { useController, useFormContext } from "react-hook-form"
import { GuildFormType } from "types"
import PhotoUploader from "./components/PhotoUploader"
import SelectorButton from "./components/SelectorButton"
import icons from "./icons.json"

type Props = {
  uploader: Uploader
}

const IconSelector = ({ uploader }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { control } = useFormContext<GuildFormType>()

  const { field } = useController({
    control,
    name: "imageUrl",
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "imageUrl",
    onChange: (e) => {
      field.onChange(e)
      onClose()
    },
    value: field.value,
  })

  const [tabIndex, setTabIndex] = React.useState(0)

  const group = getRootProps()
  useEffect(() => {
    const svg = field.value.split("/").pop().split(".")[0]
    icons.map((e, i) => {
      if (e.icons.includes(Number(svg))) {
        setTabIndex(i)
      }
    })
  }, [field.value])

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
            <PhotoUploader uploader={uploader} closeModal={onClose} />
            <LogicDivider logic="OR" px="0" my="5" />
            <FormControl>
              <FormLabel>Choose from default icons</FormLabel>
              <Tabs
                isFitted
                variant="enclosed"
                defaultIndex={tabIndex}
                colorScheme="white"
                onChange={(index) => setTabIndex(index)}
              >
                <TabList>
                  {icons.map((tab, index) => {
                    const radio = getRadioProps({
                      value: `/guildLogos/${tab.logo}.svg`,
                    })
                    return (
                      <Tab borderBottom={0} key={index}>
                        {index == tabIndex ? tab.name : ""}
                        <img src={`/guildLogos/${tab.logo}.svg`} />
                      </Tab>
                    )
                  })}
                </TabList>
                <TabPanels>
                  {icons.map((tab, index) => (
                    <TabPanel p={4} key={index}>
                      <SimpleGrid
                        minChildWidth="var(--chakra-sizes-10)"
                        spacing="4"
                        {...group}
                      >
                        {tab.icons.map((x, i) => {
                          const radio = getRadioProps({
                            value: `/guildLogos/${x}.svg`,
                          })
                          return <SelectorButton key={i} {...radio} />
                        })}
                      </SimpleGrid>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default IconSelector
