import { Box, Spinner, Stack, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NotConnectedError from "components/admin/common/NotConnectedError"
import useCommunityData from "components/admin/hooks/useCommunityData"
import useRedirectIfNotOwner from "components/admin/hooks/useRedirectIfNotOwner"
import useSubmitCommunityData from "components/admin/hooks/useSubmitCommunityData"
import Appearance from "components/admin/index/Appearance"
import Details from "components/admin/index/Details"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import { AnimatePresence, motion } from "framer-motion"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

const AdminHomePage = (): JSX.Element => {
  const { chainId, account } = useWeb3React()
  const [colorCode, setColorCode] = useState<string>(null)
  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    colorCode || "#71717a"
  )
  const { communityData } = useCommunityData()
  const isOwner = useRedirectIfNotOwner(
    communityData?.owner?.address,
    `/${communityData?.urlName}`
  )
  const methods = useForm({ mode: "all" })

  const { onSubmit, loading } = useSubmitCommunityData("PATCH")

  // Set up the default form field values if we have the necessary data
  useEffect(() => {
    if (communityData) {
      // Reset the form state so we can watch the "isDirty" prop
      methods.reset({
        name: communityData.name,
        urlName: communityData.urlName,
        description: communityData.description,
        chainName: communityData.chainData.name, // Maybe we'll need to think about this one, because currently we're displaying the active chain's name inside the form!
        themeColor: communityData.themeColor,
        tokenAddress: communityData.chainData.token.address,
      })
    }
  }, [communityData])

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  // If the user isn't logged in, display an error message
  if (!chainId) {
    return (
      <NotConnectedError
        title={communityData ? `${communityData.name} - Settings` : "Loading..."}
      />
    )
  }

  // If we haven't fetched the community data / form data yet, display a spinner
  if (!communityData || !methods)
    return (
      <Box sx={generatedColors}>
        <VStack pt={16} justifyItems="center">
          <Spinner size="xl" />
        </VStack>
      </Box>
    )

  // Otherwise render the admin page
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <FormProvider {...methods}>
          <Box sx={generatedColors}>
            <Layout
              title={`${communityData.name} - Settings`}
              imageUrl={communityData.imageUrl}
            >
              {account && isOwner && (
                <Stack spacing={{ base: 7, xl: 9 }}>
                  <Pagination
                    isAdminPage
                    saveBtnLoading={loading}
                    onSaveClick={
                      methods.formState.isDirty && methods.handleSubmit(onSubmit)
                    }
                  />
                  <VStack spacing={12}>
                    <Details isAdminPage />
                    <Appearance
                      onColorChange={(newColor: string) => setColorCode(newColor)}
                    />
                  </VStack>
                </Stack>
              )}
            </Layout>
          </Box>
        </FormProvider>
      </motion.div>
    </AnimatePresence>
  )
}

export default AdminHomePage
