import { z } from "zod";
import { IdentityTypeSchema } from "./identity";

const CreateRuleSchema = z.object({
  /**
   * TODO
   * - I don't know how will we create rules
   */
});

const TextNodeSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("TEXT"),
  position: z.literal("HEADER"),
  value: z.string().min(1),
});

const ChainIndicatorNodeSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("CHAIN_INDICATOR"),
  position: z.literal("FOOTER"),
  value: z.string(), // TODO: maybe allow supported chains only?
});

const ExternalLinkNodeSchema = z.object({
  id: z.string().uuid(),
  type: z.literal("EXTERNAL_LINK"),
  position: z.literal("FOOTER"),
  value: z.string().min(1),
  href: z.string().url(),
});

const RequirementNodeSchema = z.discriminatedUnion("type", [
  TextNodeSchema,
  ChainIndicatorNodeSchema,
  ExternalLinkNodeSchema,
]);

export const RuleSchema = CreateRuleSchema.extend({
  accessRuleId: z.string().uuid(),
  integration: z.object({
    id: z.string(),
    displayName: z.string(),
    identityType: IdentityTypeSchema,
  }),
  config: z
    .object({
      platform: z.string(), // TODO: platform schema
      type: z.string(), // TODO: maybe this isn't a fixed property?
      id: z.string(),
    })
    .and(z.record(z.string().or(z.record(z.string())))),
  params: z.object({
    op: z.enum(["greater", "less", "equal"]),
    field: z.string(), // TODO: I'm not sure if field & value are fixed props
    value: z.string(),
  }),
  ui: z.object({
    imageUrl: z.literal("").or(z.string().url().optional()),
    nodes: z.array(RequirementNodeSchema),
  }),
});

export type Rule = z.infer<typeof RuleSchema>;
