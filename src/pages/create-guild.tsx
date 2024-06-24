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

  const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#37373a") // dark color is from whiteAlpha.200, but without opacity so it can overlay the banner image
  const bgOpacity = useColorModeValue(0.06, 0.06)
  const pageBgColor = useColorModeValue(
    "var(--chakra-colors-gray-100)",
    "var(--chakra-colors-gray-800)"
  )
  const circleBgColor = useColorModeValue("#c5c5ca", "#52525b")

  return (
    <>
      <Layout.Root>
        <Box
          bg={`radial-gradient(ellipse at center, transparent 20%, ${pageBgColor}), url("${svgToTinyDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${circleBgColor}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
          )}")`}
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
                bgPosition: "top 10px right 0px",
                opacity: bgOpacity,
              }}
              offset={200}
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
