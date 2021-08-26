import { Box, Spinner, Stack, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NotConnectedError from "components/admin/common/NotConnectedError"
import Levels from "components/admin/community/Levels"
import Platforms from "components/admin/community/Platforms"
import useCommunityData from "components/admin/hooks/useCommunityData"
import useRedirectIfNotOwner from "components/admin/hooks/useRedirectIfNotOwner"
import useSubmitLevelsData from "components/admin/hooks/useSubmitLevelsData"
import convertMsToMonths from "components/admin/utils/convertMsToMonths"
import Layout from "components/common/Layout"
import Pagination from "components/[community]/common/Pagination"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import { AnimatePresence, motion } from "framer-motion"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import React, { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { RequirementType } from "temporaryData/types"

export type Level = {
  id: number
  dbId: number
  name: string
  image: string
  description: string
  requirementType: RequirementType
  requirement: number
  stakeTimelockMs: string | number
  telegramGroupId: string
  tokenSymbol?: string
}

export type FormData = {
  tokenSymbol: string
  isTGEnabled: boolean
  stakeToken: string
  isDCEnabled: boolean
  discordServerId: string
  inviteChannel: string
  levels: Level[]
}

const AdminCommunityPage = (): JSX.Element => {
  const { chainId, account } = useWeb3React()
  const { communityData } = useCommunityData()
  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    communityData?.themeColor || "#71717a"
  )
  const isOwner = useRedirectIfNotOwner(
    communityData?.owner?.address,
    `/${communityData?.urlName}`
  )
  const methods = useForm({ mode: "all" })

  const HTTPMethod = communityData?.levels?.length > 0 ? "PATCH" : "POST"

  const { loading, onSubmit } = useSubmitLevelsData(HTTPMethod)

  // Set up the default form field values if we have the necessary data
  useEffect(() => {
    if (communityData) {
      const discordServer = communityData.communityPlatforms.find(
        (platform) => platform.active && platform.name === "DISCORD"
      )

      // Reset the form state so we can watch the "isDirty" prop
      methods.reset({
        tokenSymbol: communityData.chainData?.token.symbol,
        isTGEnabled: !!communityData.communityPlatforms
          .filter((platform) => platform.active)
          .find((platform) => platform.name === "TELEGRAM"),
        stakeToken: communityData.chainData.stakeToken,
        isDCEnabled: !!discordServer,
        discordServerId: discordServer?.platformId || undefined,
        inviteChannel: discordServer?.inviteChannel || undefined,
        levels: communityData.levels.map((level) => ({
          id: level.id,
          dbId: level.id, // Needed for proper form management
          name: level.name || undefined,
          image: level.imageUrl || undefined,
          description: level.description || undefined,
          requirementType: level.requirementType,
          requirement: level.requirement || undefined,
          stakeTimelockMs: convertMsToMonths(level.stakeTimelockMs),
          telegramGroupId: level.telegramGroupId || undefined,
        })),
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
                    doneBtnUrl="community"
                    isAdminPage
                    saveBtnLoading={loading}
                    onSaveClick={
                      methods.formState.isDirty && methods.handleSubmit(onSubmit)
                    }
                  />
                  <VStack pb={{ base: 16, xl: 0 }} spacing={12}>
                    <Platforms
                      comingSoon={communityData?.levels?.length > 0}
                      activePlatforms={communityData.communityPlatforms.filter(
                        (platform) => platform.active
                      )}
                    />
                    <Levels />
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

export default AdminCommunityPage
