import { createRouter } from './context'
import superjson from 'superjson'

import { userRouter } from './user'
import { playerRouter } from './player'
import { gameRouter } from './game'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('user.', userRouter)
  .merge('player.', playerRouter)
  .merge('game.', gameRouter)

// export type definition of API
export type AppRouter = typeof appRouter
