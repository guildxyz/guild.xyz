import { Users, CircleWavyCheck } from "@phosphor-icons/react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { Badge } from "./ui/Badge"
import { GuildBase } from "types"
import pluralize from "utils/pluralize"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/Tooltip"

type Props = {
  guildData: GuildBase
}

export const GuildCard: React.FC<Props> = ({ guildData }) => (
  <div className="-z-10 grid grid-cols-[auto,1fr] grid-rows-2 items-center gap-x-4 gap-y-1 rounded-lg bg-card px-6 py-7 text-card-foreground">
    <Avatar className="row-span-2 size-12">
      <AvatarImage src={guildData.imageUrl} alt="guild emblem" />
      <AvatarFallback>G</AvatarFallback>
    </Avatar>
    <div className="flex items-center gap-1">
      <h3 className="max-w-36 truncate text-lg font-bold tracking-tight text-foreground">
        {guildData.name}
      </h3>
      {guildData.tags.includes("VERIFIED") && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="relative" aria-label="verified">
              <div
                className="absolute inset-1 rounded-full bg-white"
                aria-hidden="true"
              />
              <CircleWavyCheck weight="fill" className="relative fill-blue-500" />
            </TooltipTrigger>
            <TooltipContent>
              This guild is verified by <code>Guild.xyz</code>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    <div className="flex gap-2">
      <Badge className="space-x-2">
        <Users />
        <span>
          {new Intl.NumberFormat("en", { notation: "compact" }).format(
            guildData.memberCount
          )}
        </span>
      </Badge>
      <Badge>{pluralize(guildData.rolesCount, "role")}</Badge>
    </div>
  </div>
)

// const VerifiedIcon = ({ size, ...chakraProps }: Props): JSX.Element => (
//   <Box as="span" {...chakraProps}>
//     <Tooltip label="This guild is verified by Guild.xyz" hasArrow>
//       {/* the check in the middle is transparent by default, we use this wrapper to make it white */}
//       <Center
//         position="relative"
//         _before={{ content: '""', bg: "white", pos: "absolute", inset: 1.5 }}
//       >
//         <Icon
//           as={CircleWavyCheck}
//           boxSize={size}
//           color={"blue.500"}
//           weight="fill"
//           zIndex={1}
//         />
//       </Center>
//     </Tooltip>
//   </Box>
// )

// import { Link } from "@chakra-ui/next-js"
// import {
//   HStack,
//   SimpleGrid,
//   Skeleton,
//   SkeletonCircle,
//   Tag,
//   TagLabel,
//   TagLeftIcon,
//   Text,
//   VStack,
//   Wrap,
// } from "@chakra-ui/react"
// import DisplayCard from "components/common/DisplayCard"
// import GuildLogo from "components/common/GuildLogo"
// import VerifiedIcon from "components/common/VerifiedIcon"
// import image from "next/image"
// import { Users } from "phosphor-react"
// import { GuildBase } from "types"
// import pluralize from "utils/pluralize"
//
// type Props = {
//   guildData: GuildBase
// }
//
// const GuildCard = ({ guildData }: Props): JSX.Element => (
//   <Link
//     href={`/${guildData.urlName}`}
//     prefetch={false}
//     _hover={{ textDecor: "none" }}
//     borderRadius="2xl"
//     w="full"
//     h="full"
//   >
//     <DisplayCard>
//       <SimpleGrid
//         templateColumns={image ? "3rem calc(100% - 5.25rem)" : "1fr"}
//         gap={4}
//         alignItems="center"
//       >
//         {image && <GuildLogo imageUrl={guildData.imageUrl} />}
//         <VStack spacing={2} alignItems="start" w="full" maxW="full" mb="0.5" mt="-1">
//           <HStack spacing={1}>
//             <Text
//               as="span"
//               fontFamily="display"
//               fontSize="lg"
//               fontWeight="bold"
//               letterSpacing="wide"
//               maxW="full"
//               noOfLines={1}
//               wordBreak="break-all"
//             >
//               {guildData.name}
//             </Text>
//             {guildData.tags?.includes("VERIFIED") && <VerifiedIcon size={5} />}
//           </HStack>
//
//           <Wrap zIndex="1">
//             <Tag as="li">
//               <TagLeftIcon as={Users} />
//               <TagLabel>
//                 {new Intl.NumberFormat("en", { notation: "compact" }).format(
//                   guildData.memberCount ?? 0
//                 )}
//               </TagLabel>
//             </Tag>
//             <Tag as="li">
//               <TagLabel>{pluralize(guildData.rolesCount ?? 0, "role")}</TagLabel>
//             </Tag>
//           </Wrap>
//         </VStack>
//         {/* {guildData.tags?.includes("FEATURED") && (
//           <Tooltip label="This guild is featured by Guild.xyz" hasArrow>
//             <ColorCardLabel
//               fallbackColor="white"
//               backgroundColor={"purple.500"}
//               label={
//                 <Icon
//                   as={PushPin}
//                   display={"flex"}
//                   alignItems={"center"}
//                   m={"2px"}
//                 />
//               }
//               top="0"
//               left="0"
//               borderBottomRightRadius="xl"
//               borderTopLeftRadius="2xl"
//               labelSize="xs"
//               px="3"
//             />
//           </Tooltip>
//         )} */}
//       </SimpleGrid>
//     </DisplayCard>
//   </Link>
// )
//
// const GuildSkeletonCard = () => (
//   <DisplayCard h="auto">
//     <SimpleGrid
//       templateColumns={image ? "3rem calc(100% - 4.25rem)" : "1fr"}
//       gap={4}
//       alignItems="center"
//     >
//       <SkeletonCircle size={"48px"} />
//       <VStack spacing={3} alignItems="start" w="full" maxW="full">
//         <Skeleton h="6" w="80%" />
//         <HStack>
//           <Skeleton h="5" w="12" />
//           <Skeleton h="5" w="16" />
//         </HStack>
//       </VStack>
//     </SimpleGrid>
//   </DisplayCard>
// )
//
// export default GuildCard
// export { GuildSkeletonCard }
