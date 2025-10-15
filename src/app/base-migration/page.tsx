import { Header } from "@/components/Header"
import {
  Layout,
  LayoutBanner,
  LayoutHeadline,
  LayoutHero,
  LayoutMain,
  LayoutTitle,
} from "@/components/Layout"
import { Avatar, AvatarImage } from "@/components/ui/Avatar"
import { buttonVariants } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"

const Page = () => (
  <Layout>
    <LayoutHero className="pb-28">
      <LayoutBanner>
        <Image
          src="https://guild-xyz.mypinata.cloud/ipfs/QmbvZpQ6jX6HCe4ecYqaU89z61YT6zZ51yEtQQ3yTHiGxc"
          alt="Base cover image"
          priority
          fill
          sizes="100vw"
          style={{
            filter: "brightness(30%)",
            objectFit: "cover",
          }}
        />
      </LayoutBanner>

      <Header />
      <LayoutHeadline className="max-w-screen-md">
        <Avatar className="row-span-2 size-20 md:size-24">
          <AvatarImage
            src="https://guild-xyz.mypinata.cloud/ipfs/QmQDHQiTF7KTBiHGC48GSoWPzDg8tWB2XZscTReqaX5tnt"
            alt="Base logo"
            width={96}
            height={96}
          />
        </Avatar>
        <LayoutTitle className="text-foreground">Base</LayoutTitle>
      </LayoutHeadline>
    </LayoutHero>

    <LayoutMain className="prose mt-16 prose-p:mt-0 prose-p:mb-4 flex max-w-screen-md flex-col prose-headings:font-display prose-headings:text-foreground prose-li:text-foreground text-foreground text-lg marker:text-foreground">
      <Card className="bg-card-secondary p-6">
        <h2 className="mt-0">Base Guild is migrating to Guild v2</h2>
        <p>
          During this upgrade, the guild is temporarily unavailable. Your existing
          roles are safe and you will be able to claim new roles once we launch.
        </p>
        <p>Base Guild v2 launches next week!</p>
        <p>Stay based!</p>
        <a
          href="https://era.guild.xyz/explorer"
          target="_blank"
          className={buttonVariants({
            colorScheme: "primary",
            className: "mt-8 no-underline",
          })}
        >
          <span>Explore Guild v2</span>
          <ArrowSquareOut weight="bold" />
        </a>
      </Card>
    </LayoutMain>
  </Layout>
)

export default Page
