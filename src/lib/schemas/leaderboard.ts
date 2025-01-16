import { z } from "zod";

const LeaderboardUserSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number(),
  rank: z.number(),
  // TODO: use the user identity schema here
  primaryIdentity: z.object({
    identityId: z.string().uuid(),
    foreignId: z.string(),
  }),
});

const LeaderboardSchema = z.object({
  leaderboard: z.array(LeaderboardUserSchema.omit({ rank: true })),
  user: LeaderboardUserSchema.optional(),
});

export type Leaderboard = z.infer<typeof LeaderboardSchema>;
