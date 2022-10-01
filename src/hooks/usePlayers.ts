import { trpc } from '../utils/trpc'

function usePlayers() {
  return trpc.useQuery(['player.list'])
}

export default usePlayers
