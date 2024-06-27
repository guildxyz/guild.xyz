import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Guild.xyz",
    short_name: "Guild.xyz",
    description:
      "Automated membership management for the platforms your community already uses.",
    theme_color: "#fff",
    background_color: "#000",
    display: "standalone",
    start_url: "/",
  }
}
