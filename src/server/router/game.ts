import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createProtectedRouter } from './context'

export const gameRouter = createProtectedRouter().mutation('add', {
  input: z.object({
    loserScore: z.number().positive(),
    winnerScore: z.number().positive(),
    winnerId: z.string(),
    loserId: z.string(),
  }),
  async resolve({ ctx, input }) {
    const { permissions } = ctx.session

    if (permissions?.includes('add:game')) {
      const match = await ctx.prisma.match.create({
        data: {
          winnerScore: input.winnerScore,
          loserScore: input.loserScore,
          winner: {
            connect: {
              id: input.winnerId,
            },
          },
          loser: {
            connect: {
              id: input.loserId,
            },
          },
        },
      })

      if (match) {
        return true
      }

      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }

    throw new TRPCError({ code: 'UNAUTHORIZED' })
  },
})
