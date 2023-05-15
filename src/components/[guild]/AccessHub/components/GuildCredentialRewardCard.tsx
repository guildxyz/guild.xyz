import { Icon, Tooltip, useColorModeValue } from "@chakra-ui/react"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import RewardCard from "components/common/RewardCard"
import useGuildPermission from "components/[guild]/hooks/useGuildPermission"
import { useMintCredentialContext } from "components/[guild]/Requirements/components/GuildCheckout/MintCredentialContext"
import dynamic from "next/dynamic"
import { CircleWavyCheck, Question } from "phosphor-react"

const DynamicMintCredential = dynamic(
  () =>
    import("components/[guild]/Requirements/components/GuildCheckout/MintCredential")
)

const GuildCredentialRewardCard = () => {
  const bgColor = useColorModeValue("var(--chakra-colors-gray-100)", "#343439")
  const bgFile = useColorModeValue("bg_light.svg", "bg.svg")

  const { isAdmin } = useGuildPermission()

  const { isImageValidating, isInvalidImage, isTooSmallImage } =
    useMintCredentialContext()

  if (isImageValidating || ((isInvalidImage || isTooSmallImage) && !isAdmin))
    return null

  return (
    <CardMotionWrapper>
      <RewardCard
        label={
          <>
            <Icon as={CircleWavyCheck} mb="-2px" mr="1.5" />
            Guild.xyz
            <Tooltip
              label="This is a built in reward by Guild.xyz" //The card will disappear once you mint your credential
              hasArrow
            >
              <Icon as={Question} mb="-2px" ml="1.5" />
            </Tooltip>
          </>
        }
        title="Guild Credential"
        image="/img/guild-credential-key-3d.svg"
        colorScheme={isInvalidImage || isTooSmallImage ? "gray" : "GUILD"}
        borderStyle={(isInvalidImage || isTooSmallImage) && "dashed"}
        description="On-chain proof of membership"
        // description={
        //   isInvalidImage || isTooSmallImage ? (
        //     <HStack>
        //       <Icon as={Warning} color="orange.300" weight="fill" />
        //       <Text as="span">{`Please upload ${
        //         isTooSmallImage ? "a bigger" : "an"
        //       } image for your guild`}</Text>
        //     </HStack>
        //   ) : (
        //     "On-chain proof of membership"
        //   )
        // }
        bg={bgColor}
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          bg: `linear-gradient(to top right, ${bgColor} 70%, transparent), url('/landing/${bgFile}')`,
          bgSize: "140%",
          bgRepeat: "no-repeat",
          bgPosition: "top 7px right 7px",
          opacity: "0.07",
        }}
      >
        {(!(isInvalidImage || isTooSmallImage) || isAdmin) && (
          <DynamicMintCredential isSetup={isInvalidImage || isTooSmallImage} />
        )}
      </RewardCard>
    </CardMotionWrapper>
  )
}

export default GuildCredentialRewardCard
