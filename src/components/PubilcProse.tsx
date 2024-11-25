import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Anchor } from "@/components/ui/Anchor";
import Markdown from "react-markdown";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkTextr from "remark-textr";
// @ts-expect-error: no typedef from module
import base from "typographic-base";

const applyTypographicBase = (prose: string) => {
  return base(prose);
};

export const PublicProse = async ({ fileName }: { fileName: string }) => {
  const file = await fs.readFile(
    path.join(process.cwd(), `public/prose/${fileName}.md`),
    "utf8",
  );
  return (
    <main className="prose prose-neutral dark:prose-invert mx-auto max-w-prose py-16 prose-headings:font-display">
      <Markdown
        components={{
          a: ({ node, ...props }) => (
            <Anchor href={props.href || ""} variant="highlighted" {...props} />
          ),
        }}
        remarkPlugins={[
          remarkGfm,
          [
            remarkTextr,
            {
              options: { locale: "en-us" },
              plugins: [applyTypographicBase],
            },
          ],
        ]}
        rehypePlugins={[
          [
            rehypeExternalLinks,
            {
              rel: ["nofollow noreferrer noopener"],
              target: "_blank",
            },
          ],
          rehypeSlug,
        ]}
      >
        {file}
      </Markdown>
    </main>
  );
};
