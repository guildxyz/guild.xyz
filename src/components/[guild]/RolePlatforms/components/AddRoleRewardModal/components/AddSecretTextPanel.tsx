import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import Button from "components/common/Button"
import useUser from "components/[guild]/hooks/useUser"
import SecretTextDataForm, {
  SecretTextRewardForm,
} from "platforms/SecretText/SecretTextDataForm/SecretTextDataForm"
import UniqueTextDataForm, {
  UniqueTextRewardForm,
} from "platforms/UniqueText/UniqueTextDataForm"
import { useState } from "react"
import { FormProvider, useFieldArray, useForm, useWatch } from "react-hook-form"
import { Visibility } from "types"

type Props = {
  onSuccess: () => void
}

enum TextPlatformName {
  TEXT,
  UNIQUE_TEXT,
}

const AddSecretTextPanel = ({ onSuccess }: Props) => {
  const { id: userId } = useUser()

  const methods = useForm<SecretTextRewardForm & UniqueTextRewardForm>({
    mode: "all",
  })

  const name = useWatch({ control: methods.control, name: "name" })
  const text = useWatch({ control: methods.control, name: "text" })

  const roleVisibility: Visibility = useWatch({ name: ".visibility" })
  const { append } = useFieldArray({
    name: "rolePlatforms",
  })

  const [tabIndex, setTabIndex] = useState(0)

  const onContinue = (data: SecretTextRewardForm & UniqueTextRewardForm) => {
    append({
      guildPlatform: {
        platformName: TextPlatformName[tabIndex],
        platformGuildId: `${TextPlatformName[
          tabIndex
        ].toLowerCase()}-${userId}-${Date.now()}`,
        platformGuildData: {
          text: TextPlatformName[tabIndex] === "TEXT" ? data.text : undefined,
          texts:
            TextPlatformName[tabIndex] === "UNIQUE_TEXT"
              ? data.texts?.filter(Boolean) ?? []
              : undefined,
          name: data.name,
          imageUrl: data.imageUrl,
        },
      },
      isNew: true,
      visibility: roleVisibility,
    })
    onSuccess()
  }

  const handleChange = (newTabIndex: number) => {
    methods.setValue("text", "")
    methods.setValue("texts", [])
    setTabIndex(newTabIndex)
  }

  return (
    <FormProvider {...methods}>
      <Tabs
        isLazy
        size="sm"
        isFitted
        variant="solid"
        colorScheme="indigo"
        onChange={handleChange}
      >
        <TabList mt="6" mb="7">
          <Tab>Same content for everyone</Tab>
          <Tab>Unique values (links, promo codes)</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SecretTextDataForm>
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
            <UniqueTextDataForm>
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
    </FormProvider>
  )
}
export default AddSecretTextPanel
