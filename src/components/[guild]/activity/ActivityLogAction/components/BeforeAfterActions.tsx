import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react"
import GuildLogo from "components/common/GuildLogo"
import RequirementDisplayComponent from "components/[guild]/Requirements/components/RequirementDisplayComponent"
import useColorPalette from "hooks/useColorPalette"
import { ArrowRight } from "phosphor-react"
import { Requirement } from "types"
import { ACTION } from "../../constants"
import { useActivityLogActionContext } from "../ActivityLogActionContext"
import ActionIcon from "./ActionIcon"
import { ActivityLogChildActionLayout } from "./ActivityLogChildAction"
import UpdatedDataGrid from "./UpdatedDataGrid"

const BeforeAfterActions = (): JSX.Element => {
  const { before, data, action } = useActivityLogActionContext()

  const previousThemeProps = {
    color: before?.color,
    backgroundImage: before?.backgroundImage,
    mode: before?.mode,
  }

  const currentThemeProps = {
    color: data?.color,
    backgroundImage: data?.backgroundImage,
    mode: data?.mode,
  }

  const previousColorPalette = useColorPalette(
    "chakra-colors-primary",
    previousThemeProps.color
  )
  const currentColorPalette = useColorPalette(
    "chakra-colors-primary",
    currentThemeProps.color
  )

  if (action === ACTION.UpdateRequirement)
    return (
      <UpdatedDataGrid
        before={
          before && (
            <RequirementDisplayComponent
              requirement={before as Requirement}
              rightElement={null}
            />
          )
        }
        after={
          <RequirementDisplayComponent
            requirement={data as Requirement}
            rightElement={null}
          />
        }
      />
    )

  if (
    !before ||
    !data ||
    !Object.keys(data).some((key) => data[key] !== before[key])
  )
    return null

  return (
    <Stack py={2} spacing={4}>
      {(before.name !== data.name || before.imageUrl !== data.imageUrl) && (
        <ActivityLogChildActionLayout
          icon={<ActionIcon action={ACTION.UpdateLogoOrTitle} size={5} />}
          label="Update logo / title:"
        >
          <UpdatedDataGrid
            before={
              <HStack>
                <GuildLogo imageUrl={before.imageUrl} size={8} />
                <Text as="span">{before.name}</Text>
              </HStack>
            }
            after={
              <HStack>
                <GuildLogo imageUrl={data.imageUrl} size={8} />
                <Text as="span">{data.name}</Text>
              </HStack>
            }
          />
        </ActivityLogChildActionLayout>
      )}

      {before.description !== data.description && (
        <ActivityLogChildActionLayout
          icon={<ActionIcon action={ACTION.UpdateDescription} size={5} />}
          label="Update description:"
        >
          <UpdatedDataGrid
            before={<Text>{before.description}</Text>}
            after={<Text>{data.description}</Text>}
          />
        </ActivityLogChildActionLayout>
      )}

      {before.logic !== data.logic && (
        <ActivityLogChildActionLayout
          icon={<ActionIcon action={ACTION.UpdateLogic} size={5} />}
          label={
            <HStack fontWeight="semibold">
              <Text as="span">Update logic:</Text>

              <HStack>
                <Text as="span">{before.logic}</Text>
                <Center>
                  <Icon as={ArrowRight} boxSize={5} />
                </Center>
                <Text as="span">{data.logic}</Text>
              </HStack>
            </HStack>
          }
        />
      )}

      {before.urlName !== data.urlName && (
        <ActivityLogChildActionLayout
          icon={<ActionIcon action={ACTION.UpdateUrlName} size={5} />}
          label="Update URL:"
          isInline
        >
          <UpdatedDataGrid
            unstyled
            before={
              <Text
                as="span"
                color="blue.400"
                fontWeight="semibold"
              >{`guild.xyz/${before.urlName}`}</Text>
            }
            after={
              <Text
                as="span"
                color="blue.400"
                fontWeight="semibold"
              >{`guild.xyz/${data.urlName}`}</Text>
            }
          />
        </ActivityLogChildActionLayout>
      )}

      {Object.values(previousThemeProps).every(Boolean) &&
        Object.keys(previousThemeProps).some(
          (key) => previousThemeProps[key] !== currentThemeProps[key]
        ) && (
          <ActivityLogChildActionLayout
            icon={<ActionIcon action={ACTION.UpdateTheme} size={5} />}
            label="Update theme:"
          >
            <UpdatedDataGrid
              boxPadding={0}
              before={
                <Flex
                  sx={{
                    ...previousColorPalette,
                  }}
                >
                  <Box
                    bgColor="primary.500"
                    bgImage={previousThemeProps.backgroundImage}
                    bgSize="cover"
                    flexGrow={1}
                  />
                  <Center px={4} py={6}>
                    <Button colorScheme="primary" size="sm" borderRadius="md">
                      Button
                    </Button>
                  </Center>
                </Flex>
              }
              after={
                <Flex
                  sx={{
                    ...currentColorPalette,
                  }}
                >
                  <Box
                    bgColor="primary.500"
                    bgImage={previousThemeProps.backgroundImage}
                    bgSize="cover"
                    flexGrow={1}
                  />
                  <Center px={4} py={6}>
                    <Button colorScheme="primary" size="sm" borderRadius="md">
                      Button
                    </Button>
                  </Center>
                </Flex>
              }
            />
          </ActivityLogChildActionLayout>
        )}
    </Stack>
  )
}

export default BeforeAfterActions
