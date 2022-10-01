import { createProtectedRouter } from './context'

export const userRouter = createProtectedRouter().query('me', {
  resolve({ ctx }) {
    return ctx.session
  },
})
