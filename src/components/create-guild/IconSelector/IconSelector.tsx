import {
  Box,
  ChakraProps,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Img,
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
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useRadioGroup,
} from "@chakra-ui/react"
import { Image } from "@phosphor-icons/react"
import { CreateGuildFormType } from "app/create-guild/types"
import LogicDivider from "components/[guild]/LogicDivider"
import GuildLogo from "components/common/GuildLogo"
import { Modal } from "components/common/Modal"
import { Uploader } from "hooks/usePinata/usePinata"
import React, { ComponentProps, useEffect } from "react"
import { useController, useFormContext } from "react-hook-form"
import PhotoUploader from "./components/PhotoUploader"
import SelectorButton from "./components/SelectorButton"
import icons from "./icons.json"

type Props = {
  uploader: Uploader
  isDisabled?: boolean
  minW?: number
  minH?: number
  onGeneratedBlobChange?: ComponentProps<
    typeof PhotoUploader
  >["onGeneratedBlobChange"]
  boxSize?: ChakraProps["boxSize"]
  iconSize?: ChakraProps["boxSize"]
}

const IconSelector = ({
  uploader,
  isDisabled,
  minW,
  minH,
  onGeneratedBlobChange,
  boxSize = 12,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { control } = useFormContext<CreateGuildFormType>()

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
    const svg = field.value?.split("/").pop()?.split(".")[0]
    icons.map((category, i) => {
      if (category.icons.includes(Number(svg))) {
        setTabIndex(i)
      }
    })
  }, [field.value])

  const { colorMode } = useColorMode()

  const iconButtonBgColor = useColorModeValue("gray.700", "blackAlpha.300")
  const iconButtonHoverBgColor = useColorModeValue("gray.600", "blackAlpha.200")
  const iconButtonActiveBgColor = useColorModeValue("gray.500", "blackAlpha.100")

  const tabBgColor = useColorModeValue("gray.100", "gray.600")
  const guildLogoSxProp = useColorModeValue({ filter: "invert(0.75)" }, {})

  return (
    <>
      <IconButton
        autoFocus
        onClick={onOpen}
        rounded="full"
        boxSize={boxSize}
        flexShrink={0}
        colorScheme="gray"
        icon={
          field.value ? (
            <GuildLogo imageUrl={field.value} bgColor="transparent" size={boxSize} />
          ) : (
            <Icon as={Image} boxSize="35%" />
          )
        }
        aria-label="Guild logo"
        variant="outline"
        borderWidth={1}
        {...(field.value || colorMode === "dark"
          ? {
              bg: iconButtonBgColor,
              _hover: { bg: iconButtonHoverBgColor },
              _active: { bg: iconButtonActiveBgColor },
            }
          : {})}
        isDisabled={isDisabled}
      />
      {!isDisabled && (
        <Modal {...{ isOpen, onClose }} size="3xl" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Choose logo</ModalHeader>
            <ModalCloseButton />
            <ModalBody className="custom-scrollbar">
              <PhotoUploader
                uploader={uploader}
                closeModal={onClose}
                minW={minW}
                minH={minH}
                onGeneratedBlobChange={onGeneratedBlobChange}
              />
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
                  <Box mx={{ base: -4, md: 0 }}>
                    <TabList
                      px={{ base: 4, md: 0 }}
                      maxW="full"
                      overflowX="auto"
                      overflowY="hidden"
                      sx={{
                        WebkitMaskImage: [
                          "linear-gradient(to right, transparent 0px, black 20px, black calc(100% - 20px), transparent)",
                          "linear-gradient(to right, transparent 0px, black 20px, black calc(100% - 20px), transparent)",
                          "none",
                        ],
                      }}
                      className="invisible-scrollbar"
                    >
                      {icons.map((tab, index) => (
                        <Tab
                          border={0}
                          bgColor={index === tabIndex ? tabBgColor : undefined}
                          key={index}
                          minW="max-content"
                        >
                          {index === tabIndex && (
                            <Text as="span" mr={2} fontSize="sm">
                              {tab.name}
                            </Text>
                          )}
                          <Img
                            src={`/guildLogos/${tab.logo}.svg`}
                            sx={guildLogoSxProp}
                          />
                        </Tab>
                      ))}
                    </TabList>
                  </Box>
                  <TabPanels>
                    {icons.map((tab, index) => (
                      <TabPanel px={0} py={4} key={index}>
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
      )}
    </>
  )
}

export default IconSelector
