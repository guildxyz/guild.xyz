import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { useAddRewardDiscardAlert } from "components/[guild]/AddRewardButton/hooks/useAddRewardDiscardAlert"
import useUser from "components/[guild]/hooks/useUser"
import Button from "components/common/Button"
import SecretTextDataForm, {
  SecretTextRewardForm,
} from "platforms/SecretText/SecretTextDataForm/SecretTextDataForm"
import UniqueTextDataForm, {
  UniqueTextRewardForm,
} from "platforms/UniqueText/UniqueTextDataForm"
import { AddRewardPanelProps } from "platforms/rewards"
import { useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { PlatformGuildData, PlatformName, PlatformType } from "types"
import DefaultAddRewardPanelWrapper from "../DefaultAddRewardPanelWrapper"

enum TextPlatformName {
  TEXT,
  UNIQUE_TEXT,
}

const AddSecretTextPanel = ({ onAdd }: AddRewardPanelProps) => {
  const { id: userId } = useUser()

  const methods = useForm<SecretTextRewardForm & UniqueTextRewardForm>({
    mode: "all",
  })
  useAddRewardDiscardAlert(methods.formState.isDirty)

  const name = useWatch({ control: methods.control, name: "name" })
  const text = useWatch({ control: methods.control, name: "text" })

  const [tabIndex, setTabIndex] = useState(0)

  const onContinue = (data: SecretTextRewardForm & UniqueTextRewardForm) => {
    const platformName = TextPlatformName[tabIndex] as PlatformName

    const platformGuildData = {
      name: data.name,
      imageUrl: data.imageUrl,
    }

    if (TextPlatformName[tabIndex] === "TEXT") {
      ;(platformGuildData as PlatformGuildData["TEXT"]).text = data.text
    }

    if (TextPlatformName[tabIndex] === "UNIQUE_TEXT") {
      ;(platformGuildData as PlatformGuildData["UNIQUE_TEXT"]).texts =
        data.texts?.filter(Boolean) ?? []
    }

    onAdd({
      guildPlatform: {
        platformName,
        platformId: PlatformType[platformName],

        platformGuildId: `${TextPlatformName[
          tabIndex
        ].toLowerCase()}-${userId}-${Date.now()}`,
        platformGuildData,
      },
      isNew: true,
    })
  }

  const handleChange = (newTabIndex: number) => {
    methods.setValue("text", "")
    methods.setValue("texts", [])
    methods.clearErrors(["text", "texts"])
    setTabIndex(newTabIndex)
  }

  return (
    <FormProvider {...methods}>
      <DefaultAddRewardPanelWrapper>
        <Tabs
          isLazy
          size="sm"
          isFitted
          variant="solid"
          colorScheme="indigo"
          onChange={handleChange}
        >
          <TabList mb="7">
            <Tab>Same content for everyone</Tab>
            <Tab>Unique values (links, promo codes)</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SecretTextDataForm
                shouldValidate={TextPlatformName[tabIndex] === "TEXT"}
              >
                <Button
                  colorScheme="indigo"
                  isDisabled={!name?.length || !text?.length}
                  w="max-content"
                  ml="auto"
                  onClick={methods.handleSubmit(onContinue)}
                >
                  Continue
                </Button>
              </SecretTextDataForm>
            </TabPanel>

            <TabPanel>
              <UniqueTextDataForm
                shouldValidate={TextPlatformName[tabIndex] === "UNIQUE_TEXT"}
              >
                <Button
                  colorScheme="indigo"
                  isDisabled={!name?.length}
                  w="max-content"
                  ml="auto"
                  onClick={methods.handleSubmit(onContinue)}
                >
                  Continue
                </Button>
              </UniqueTextDataForm>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </DefaultAddRewardPanelWrapper>
    </FormProvider>
  )
}
export default AddSecretTextPanel
