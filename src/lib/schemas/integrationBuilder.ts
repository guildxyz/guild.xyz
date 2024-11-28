import { z } from "zod";

const IdentitySchema = z.enum([
  "address",
  "discord",
  "telegram",
  "github",
  "farcaster",
]); // TODO: add all identities

const PrimitiveTypeSchema = z.string().or(z.number()).or(z.boolean());
const OpSchema = z.object({ op: z.enum(["add", "set"]) });
const UUIDSchema = z.string().uuid();

const CreateIntegrationSchema = z.object({
  display_name: z.string().min(1),
  identity_type: IdentitySchema,
  incoming_data_config: z.object({
    fields: z.array(
      z.object({
        name: z.string().min(1),
        type: z.enum(["string", "number", "boolean"]),
        ops: z.array(OpSchema),
      }),
    ),
  }),
});

const IntegrationSchema = CreateIntegrationSchema.extend({
  id: UUIDSchema,
});

export type Integration = z.infer<typeof IntegrationSchema>;

const CreateConfigurationSchema = z.object({
  integration_id: UUIDSchema,
  data: z.record(PrimitiveTypeSchema),
});

const ConfigurationSchema = CreateConfigurationSchema.extend({
  id: UUIDSchema,
});

export type Configuration = z.infer<typeof ConfigurationSchema>;

// ---------- ---------- ---------- ---------- //

const TextNodeSchema = z.object({
  id: UUIDSchema,
  type: z.literal("TEXT"),
  value: z.string().min(1),
});

const ChainIndicatorNodeSchema = z.object({
  id: UUIDSchema,
  type: z.literal("CHAIN_INDICATOR"),
  value: z.number().positive(),
});

const ExternalLinkNodeSchema = z.object({
  id: UUIDSchema,
  type: z.literal("EXTERNAL_LINK"),
  href: z.string().url(),
  value: z.string().min(1),
});

const RequirementDisplayNodeConfigSchema = z.discriminatedUnion("type", [
  TextNodeSchema,
  ChainIndicatorNodeSchema,
  ExternalLinkNodeSchema,
]);

export type RequirementDisplayNodeConfig = z.infer<
  typeof RequirementDisplayNodeConfigSchema
>;

const RequirementDisplayComponentConfigSchema = z.object({
  configurationId: UUIDSchema,
  contentNodes: z.array(RequirementDisplayNodeConfigSchema),
  footerNodes: z.array(RequirementDisplayNodeConfigSchema),
});

export type RequirementDisplayComponentConfig = z.infer<
  typeof RequirementDisplayComponentConfigSchema
>;
