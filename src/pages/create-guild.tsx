import { Box, useColorModeValue } from "@chakra-ui/react"
import { ThemeProvider } from "components/[guild]/ThemeContext"
import ClientOnly from "components/common/ClientOnly"
import { Layout } from "components/common/Layout"
import CreateGuildForm, {
  CreateGuildFormType,
} from "components/create-guild/CreateGuildForm"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import svgToTinyDataUri from "mini-svg-data-uri"
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

  const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#1d1d1f")
  const bgOpacity = useColorModeValue(0.06, 0.06)
  const pageBgColor = useColorModeValue(
    "var(--chakra-colors-gray-100)",
    "var(--chakra-colors-gray-800)"
  )
  const bgPatternColor = useColorModeValue("#c5c5ca", "#52525b")

  return (
    <>
      <Layout.Root>
        <Box
          bg={`radial-gradient(ellipse at center, transparent -250%, ${pageBgColor} 80%), url("${svgToTinyDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="${bgPatternColor}"><path d="M0 .5H31.5V32"/></svg>`
          )}")`}
          bgPosition="top 16px left 0px"
          minH="100vh"
        >
          <Layout.Head ogTitle="Begin your guild" />
          <Layout.HeaderSection>
            <Layout.Background
              opacity={1}
              bgColor={bgColor}
              _before={{
                content: '""',
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                bg: `radial-gradient(circle at bottom, transparent 5%, ${bgColor}), url('/banner.png ')`,
                bgSize: { base: "auto 100%", sm: "auto 115%" },
                bgPosition: "top 5px right 0px",
                opacity: bgOpacity,
              }}
              borderBottomWidth="1px"
              borderStyle="dashed"
              offset={200}
              boxShadow="inset 1px -2px 8px 0px rgba(0, 0, 0, 0.06)"
            />
            <Layout.Header />
          </Layout.HeaderSection>
          <Layout.MainSection>
            <ClientOnly>
              <FormProvider {...methods}>
                <CreateGuildForm />
                <DynamicDevTool control={methods.control} />
              </FormProvider>
            </ClientOnly>
          </Layout.MainSection>
        </Box>
      </Layout.Root>
    </>
  )
}

const CreateGuildPageWrapper = (): JSX.Element => (
  <ThemeProvider>
    <CreateGuildPage />
  </ThemeProvider>
)

export default CreateGuildPageWrapper
