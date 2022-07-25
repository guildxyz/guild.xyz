import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  Spinner,
  Stack,
} from "@chakra-ui/react"
import { WithRumComponentContext } from "@datadog/rum-react-integration"
import Button from "components/common/Button"
import useGoogleGateables from "components/common/GoogleGuildSetup/hooks/useGoogleGateables"
import Layout from "components/common/Layout"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import useGoogleAuth from "components/[guild]/RolesByPlatform/components/JoinButton/components/JoinModal/hooks/useGoogleAuth"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { GuildFormType } from "types"
import getRandomInt from "utils/getRandomInt"

const defaultValues: GuildFormType = {
  name: "",
  description: "",
  imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
  guildPlatforms: [
    {
      platformName: "GOOGLE",
      platformGuildId: "",
    },
  ],
  roles: [
    {
      name: "Member",
      logic: "AND",
      imageUrl: `/guildLogos/${getRandomInt(286)}.svg`,
      requirements: [{ type: "FREE" }],
      rolePlatforms: [
        {
          guildPlatformIndex: 0,
        },
      ],
    },
  ],
}

const CreateGuildGooglePage = (): JSX.Element => {
  const router = useRouter()

  const { code } = useGoogleAuth()
  const {
    response: googleGateables,
    onSubmit: fetchGoogleGateables,
    isLoading,
    isSigning,
  } = useGoogleGateables()

  useEffect(() => {
    if (!code) {
      router.push("/create-guild")
    }
  }, [code])

  const methods = useForm<GuildFormType>({ mode: "all", defaultValues })

  return (
    <Layout title="Create Guild for Google Workspaces">
      <FormProvider {...methods}>
        {isLoading || isSigning ? (
          <Flex justifyContent="center">
            <Spinner />
          </Flex>
        ) : googleGateables ? (
          <>TODO</>
        ) : (
          <Alert status="info">
            <AlertIcon />
            <Stack w="full" direction={{ base: "column", md: "row" }} spacing={4}>
              <Stack>
                <AlertTitle>Permission required</AlertTitle>
                <AlertDescription>
                  Please sign a message so we can fetch your Google documents which
                  you can gate using Guild.xyz.
                </AlertDescription>
              </Stack>

              <Flex alignItems="center" justifyContent="end">
                <Button
                  onClick={() =>
                    fetchGoogleGateables({
                      platformName: "GOOGLE",
                    })
                  }
                >
                  Sign message
                </Button>
              </Flex>
            </Stack>
          </Alert>
        )}
        <DynamicDevTool control={methods.control} />
      </FormProvider>
    </Layout>
  )
}

export default WithRumComponentContext(
  "Create Google guild page",
  CreateGuildGooglePage
)
