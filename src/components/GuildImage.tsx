import { cn } from "@/lib/cssUtils";
import type { Guild } from "@/lib/schemas/guild";
import { ImageSquare } from "@phosphor-icons/react/dist/ssr";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

type Props = {
  className?: string;
  name: Guild["name"];
  imageUrl: Guild["imageUrl"];
};

export const GuildImage = ({ name, imageUrl, className }: Props) => (
  <Avatar
    className={cn(
      "grid size-12 place-items-center overflow-hidden rounded-full bg-image text-white",
      className,
    )}
  >
    <AvatarImage
      src={
        !!imageUrl && !imageUrl.startsWith("/guildLogos") ? imageUrl : undefined
      }
      className="size-full"
      alt={`${name} logo`}
    />
    <AvatarFallback className="grid size-full place-items-center">
      <ImageSquare weight="duotone" className="size-2/5" />
    </AvatarFallback>
  </Avatar>
);
