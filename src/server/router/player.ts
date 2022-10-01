import { createRouter } from './context'

export const playerRouter = createRouter().query('list', {
  async resolve({ ctx }) {
    const users = await ctx.prisma.user.findMany({
      include: {
        _count: {
          select: {
            wonMatches: true,
            lostMatches: true,
          },
        },
        lostMatches: {
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
        wonMatches: {
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
      },
    })

    users.sort((a, b) => {
      const aWon = a.wonMatches[0]
      const bWon = b.wonMatches[0]

      if (aWon && bWon) {
        if (aWon.date.getTime() < bWon.date.getTime()) {
          return -1
        }

        if (aWon.date.getTime() > bWon.date.getTime()) {
          return 1
        }
      }

      if (aWon) {
        return 1
      }

      if (bWon) {
        return -1
      }

      return 0
    })

    const rankings: typeof users = []
    const unranked: typeof users = []

    users.forEach((user) => {
      const won = user.wonMatches[0]
      if (won) {
        const idx = rankings.findIndex((r) => r.id === won.loserId)
        if (idx === -1) {
          rankings.push(user)
        } else {
          rankings.splice(idx, 0, user)
        }
      } else {
        if (user.lostMatches && user.lostMatches.length > 0) {
          rankings.push(user)
        } else {
          unranked.push(user)
        }
      }
    })

    return rankings.concat(unranked)
  },
})
