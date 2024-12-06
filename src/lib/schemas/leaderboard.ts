import { z } from "zod";

const LeaderboardUserSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number(),
  rank: z.number(),
});

const LeaderboardSchema = z.object({
  leaderboard: z.array(LeaderboardUserSchema.omit({ rank: true })),
  user: LeaderboardUserSchema,
});

export type Leaderboard = z.infer<typeof LeaderboardSchema>;
