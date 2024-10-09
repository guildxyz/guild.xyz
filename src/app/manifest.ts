import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Guild.xyz",
    short_name: "Guild.xyz",
    description:
      "Automated membership management for the platforms your community already uses.",
    theme_color: "#fff",
    background_color: "#6062eb",
    display: "standalone",
    start_url: "/",
    screenshots: [
      {
        src: "banner.svg",
        type: "wide",
        sizes: "1791x565",
      },
    ],
    icons: [
      {
        src: `guild-castle.svg`,
        sizes: `64x64`,
        type: "image/svg",
        // @ts-ignore: "maskable any" is not typed out as an option
        purpose: "maskable any",
      },
      {
        src: `guild-castle.png`,
        sizes: `144x144`,
        type: "image/png",
        // @ts-ignore: "maskable any" is not typed out as an option
        purpose: "maskable any",
      },
      {
        src: `guild-icon.png`,
        sizes: `64x64`,
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
