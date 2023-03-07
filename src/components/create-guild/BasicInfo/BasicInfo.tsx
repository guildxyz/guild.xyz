import { Box, FormLabel, HStack, SimpleGrid, Stack } from "@chakra-ui/react"
import Card from "components/common/Card"
import Section from "components/common/Section"
import UrlName from "components/[guild]/EditGuild/components/UrlName"
import usePinata from "hooks/usePinata"
import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import slugify from "slugify"
import { GuildFormType } from "types"
import getRandomInt from "utils/getRandomInt"
import CreateGuildButton from "../CreateGuildButton"
import { useCreateGuildContext } from "../CreateGuildContext"
import Description from "../Description"
import IconSelector from "../IconSelector"
import Name from "../Name"
import Pagination from "../Pagination"
import ContactInfo from "./components/ContactInfo"
import TwitterUrlInput from "./components/TwitterUrlInput"

const BasicInfo = (): JSX.Element => {
  const { template } = useCreateGuildContext()
  const {
    control,
    getValues,
    setValue,
    formState: { errors, dirtyFields },
  } = useFormContext<GuildFormType>()

  const name = useWatch({ control, name: "name" })

  const iconUploader = usePinata({
    onSuccess: ({ IpfsHash }) => {
      setValue("imageUrl", `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${IpfsHash}`, {
        shouldTouch: true,
      })
    },
    onError: () => {
      setValue("imageUrl", `/guildLogos/${getRandomInt(286)}.svg`, {
        shouldTouch: true,
      })
    },
  })

  useEffect(() => {
    if (name && !dirtyFields.urlName)
      setValue("urlName", slugify(name), { shouldValidate: true })
  }, [name, dirtyFields])

  return (
    <>
      <Card px={{ base: 5, sm: 6 }} py={8}>
        <Stack spacing={10}>
          <Stack spacing={{ base: 5, md: 6 }}>
            <SimpleGrid
              w="full"
              spacing="5"
              templateColumns={{ base: "1fr", md: "1fr 1fr" }}
            >
              <Box flex="1">
                <FormLabel>Logo and name</FormLabel>
                <HStack alignItems="start">
                  <IconSelector uploader={iconUploader} />
                  <Name width={null} />
                </HStack>
              </Box>
              <UrlName maxWidth="unset" />
            </SimpleGrid>
            <Description />
          </Stack>

          <Section title="How could we contact you?" spacing="4">
            <ContactInfo showAddButton={false} />
          </Section>

          {template === "GROWTH" && (
            <Section title="Template required socials" spacing="4">
              <TwitterUrlInput />
            </Section>
          )}
        </Stack>
      </Card>

      <Pagination nextButtonHidden>
        <CreateGuildButton
          isDisabled={
            !name ||
            !!Object.values(errors).length ||
            (template === "GROWTH" && !getValues("socialLinks.TWITTER"))
          }
        />
      </Pagination>
    </>
  )
}

export default BasicInfo
