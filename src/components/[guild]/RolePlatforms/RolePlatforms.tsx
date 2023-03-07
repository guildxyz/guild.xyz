import {
  CloseButton,
  SimpleGrid,
  Spacer,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import AddCard from "components/common/AddCard"
import Button from "components/common/Button"
import Section from "components/common/Section"
import TransitioningPlatformIcons from "components/[guild]/RolePlatforms/components/TransitioningPlatformIcons"
import { Plus } from "phosphor-react"
import platforms from "platforms/platforms"
import { useFormContext, useWatch } from "react-hook-form"
import { GuildPlatform, PlatformType } from "types"
import useGuild from "../hooks/useGuild"
import AddRoleRewardModal from "./components/AddRoleRewardModal"
import PlatformCard from "./components/PlatformCard"
import RemovePlatformButton from "./components/RemovePlatformButton"
import { RolePlatformProvider } from "./components/RolePlatformProvider"

type Props = {
  roleId?: number
}

const RolePlatforms = ({ roleId }: Props) => {
  const { guildPlatforms } = useGuild()
  const { setValue } = useFormContext()

  /**
   * Using fields like this with useWatch because the one from useFieldArray is not
   * reactive to the append triggered in the add platform button
   */
  const fields = useWatch({ name: "rolePlatforms" })

  const { isOpen, onOpen, onClose } = useDisclosure()

  const removeButtonColor = useColorModeValue("gray.700", "gray.400")
  const rewardsLabel = useBreakpointValue({
    base: "/ accesses",
    sm: "/ platform accesses",
  })

  return (
    <Section
      title="Rewards"
      titleRightElement={
        <>
          <Text as="span" fontSize="sm" colorScheme={"gray"}>
            {rewardsLabel}
          </Text>
          <Spacer />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Plus />}
            rightIcon={<TransitioningPlatformIcons boxSize="4" />}
            onClick={onOpen}
          >
            Add reward
          </Button>
        </>
      }
    >
      <SimpleGrid spacing={{ base: 3 }}>
        {!fields || fields?.length <= 0 ? (
          <AddCard title="Add reward" onClick={onOpen} />
        ) : (
          fields.map((rolePlatform: any, index) => {
            let guildPlatform: GuildPlatform, type
            if (rolePlatform.guildPlatformId) {
              guildPlatform = guildPlatforms.find(
                (platform) => platform.id === rolePlatform.guildPlatformId
              )
              type = PlatformType[guildPlatform?.platformId]
            } else {
              guildPlatform = rolePlatform.guildPlatform
              type = guildPlatform.platformName
            }

            if (!type) return null

            const { cardPropsHook: useCardProps, cardSettingsComponent } =
              platforms[type]

            let PlatformCardSettings = cardSettingsComponent
            // only show Google access level settings and Discord role settings for new platforms
            if (!rolePlatform.isNew) PlatformCardSettings = null

            return (
              <RolePlatformProvider
                key={index}
                rolePlatform={{
                  ...rolePlatform,
                  roleId,
                  guildPlatform,
                  index,
                }}
              >
                <PlatformCard
                  usePlatformProps={useCardProps}
                  guildPlatform={guildPlatform}
                  cornerButton={
                    !rolePlatform.isNew ? (
                      <RemovePlatformButton
                        removeButtonColor={removeButtonColor}
                        guildPlatform={guildPlatform}
                      />
                    ) : (
                      <CloseButton
                        size="sm"
                        color={removeButtonColor}
                        rounded="full"
                        aria-label="Remove platform"
                        zIndex="1"
                        onClick={() => {
                          setValue(
                            `rolePlatforms`,
                            fields.filter((_, i) => i !== index)
                          )
                        }}
                      />
                    )
                  }
                  actionRow={PlatformCardSettings && <PlatformCardSettings />}
                />
              </RolePlatformProvider>
            )
          })
        )}
      </SimpleGrid>
      <AddRoleRewardModal {...{ isOpen, onClose }} />
    </Section>
  )
}

export default RolePlatforms
