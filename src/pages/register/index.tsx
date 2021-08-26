import { Box, Stack, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NotConnectedError from "components/admin/common/NotConnectedError"
import useSubmitCommunityData from "components/admin/hooks/useSubmitCommunityData"
import Appearance from "components/admin/index/Appearance"
import Details from "components/admin/index/Details"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import React, { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

const Page = (): JSX.Element => {
  const { chainId } = useWeb3React()
  const [colorCode, setColorCode] = useState<string>(null)
  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    colorCode || "#71717a"
  )

  const methods = useForm({
    mode: "all",
    defaultValues: {
      name: "",
      urlName: "",
      description: "",
      chainName: "",
      themeColor: "",
      tokenAddress: "",
    },
  })

  const { onSubmit, loading } = useSubmitCommunityData("POST")

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  if (!chainId) {
    return <NotConnectedError title="Integrate token" />
  }

  return (
    <>
      <FormProvider {...methods}>
        <Box sx={generatedColors}>
          <Layout title="Integrate token">
            <Stack spacing={{ base: 7, xl: 9 }}>
              <Pagination
                isAdminPage
                isCommunityTabDisabled
                onSaveClick={methods.handleSubmit(onSubmit)}
                saveBtnLoading={loading}
              />
              <VStack spacing={12}>
                <Details />
                <Appearance
                  onColorChange={(newColor: string) => setColorCode(newColor)}
                />
              </VStack>
            </Stack>
          </Layout>
        </Box>
      </FormProvider>
    </>
  )
}

export default Page
