import { trpc } from '../utils/trpc'

function useMe() {
  return trpc.useQuery(['user.me'], {
    refetchOnWindowFocus(query) {
      return !!query.state.data?.user
    },
  })
}

export default useMe
