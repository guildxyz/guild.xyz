import { useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import { ThemeProvider } from "components/[guild]/ThemeContext"
import ClientOnly from "components/common/ClientOnly"
import { Layout } from "components/common/Layout"
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

  const bgColor = useColorModeValue("var(--chakra-colors-gray-800)", "#37373a") // dark color is from whiteAlpha.200, but without opacity so it can overlay the banner image
  const bgOpacity = useColorModeValue(0.06, 0.1)
  const bgLinearPercentage = useBreakpointValue({ base: "50%", sm: "55%" })

  return (
    <>
      <Layout.Root>
        <Layout.Head ogTitle="Begin your guild" />
        <Layout.HeaderSection>
          <Layout.Background
            opacity={1}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              bg: `linear-gradient(to top right, ${bgColor} ${bgLinearPercentage}, transparent), url('/banner.png ')`,
              bgSize: { base: "auto 100%", sm: "auto 115%" },
              bgRepeat: "no-repeat",
              bgPosition: "top 10px right 0px",
              opacity: bgOpacity,
            }}
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
