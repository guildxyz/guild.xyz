import { Box, useColorModeValue } from "@chakra-ui/react"
import { ThemeProvider } from "components/[guild]/ThemeContext"
import ClientOnly from "components/common/ClientOnly"
import { Layout } from "components/common/Layout"
import Head from "components/common/Layout/components/Head"
import CreateGuildForm, {
  CreateGuildFormType,
} from "components/create-guild/CreateGuildForm"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { FormProvider, useForm } from "react-hook-form"

const CreateGuildPage = (): JSX.Element => {
  const methods = useForm<CreateGuildFormType>({
    mode: "all",
    defaultValues: {
      name: "",
      imageUrl: "",
      contacts: [
        {
          type: "EMAIL",
          contact: "",
        },
      ],
    },
  })

  const bgColor = useColorModeValue(
    "var(--chakra-colors-gray-400)",
    "var(--chakra-colors-gray-700)"
  )
  const bgFile = useColorModeValue("bg_light.svg", "bg.svg")

  return (
    <>
      <Head ogTitle="Begin your guild" />
      <ClientOnly>
        <FormProvider {...methods}>
          <Box
            display="grid"
            gridTemplateRows="auto,1fr"
            gap={8}
            h="100vh"
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              bg: `radial-gradient(circle at 50% 75%, ${bgColor} 60%, transparent), url('/landing/${bgFile}')`,
              bgSize: "var(--chakra-sizes-container-md)",
              bgPosition: "top center, top 0.5rem center",
              opacity: "0.07",
              zIndex: -1,
            }}
          >
            <Layout.Header />

            <CreateGuildForm />
          </Box>

          <DynamicDevTool control={methods.control} />
        </FormProvider>
      </ClientOnly>
    </>
  )
}

const CreateGuildPageWrapper = (): JSX.Element => (
  <ThemeProvider>
    <CreateGuildPage />
  </ThemeProvider>
)

export default CreateGuildPageWrapper
