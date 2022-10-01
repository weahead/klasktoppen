import Modal from './Modal'
import useAddGameModalStore from '../stores/addGameModal'
import usePlayers from '../hooks/usePlayers'

import type { FormEvent } from 'react'
import { trpc } from '../utils/trpc'

export default function AddGameModal() {
  const isOpen = useAddGameModalStore((state) => state.isOpen)
  const close = useAddGameModalStore((state) => state.close)

  const { invalidateQueries } = trpc.useContext()

  const add = trpc.useMutation(['game.add'], {
    onSuccess() {
      invalidateQueries(['player.list'])
    },
  })

  const players = usePlayers()

  function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault()

    const data = new FormData(evt.currentTarget)
    const player1 = data.get('player1') as string
    const player2 = data.get('player2') as string
    const score1 = parseInt(data.get('score1') as string)
    const score2 = parseInt(data.get('score2') as string)

    if (player1 && player2 && score1 && score2) {
      const winnerScore = Math.max(score1, score2)
      const loserScore = Math.min(score1, score2)

      let loserId: string, winnerId: string
      if (score1 > score2) {
        winnerId = player1
        loserId = player2
      } else if (score2 > score1) {
        winnerId = player2
        loserId = player1
      } else {
        throw new Error('Draw is not possible!!!')
      }

      add.mutate({
        loserId,
        loserScore,
        winnerId,
        winnerScore,
      })

      close()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={close} title="Add match">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center">
          <div className="flex flex-1 flex-col gap-4">
            <label>
              <div className="sr-only">Player 1</div>
              <select name="player1" className="w-4/5 rounded-md border p-2">
                {players.data?.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <div className="sr-only">Player 1 score</div>
              <input
                required
                type="number"
                name="score1"
                className="w-16 border text-center text-5xl"
              />
            </label>
          </div>

          <div className="flex-none p-2 text-2xl font-bold">VS</div>

          <div className="flex flex-1 flex-col gap-4">
            <label>
              <div className="sr-only">Player 2</div>
              <select name="player2" className="w-4/5 rounded-md border p-2">
                {players.data?.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <div className="sr-only">Player 2 score</div>
              <input
                required
                type="number"
                name="score2"
                className="w-16 border text-center text-5xl"
              />
            </label>
          </div>
        </div>
        <div className="mt-8">
          <button
            type="submit"
            className="w-full rounded-md border border-transparent bg-green-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
      </form>
    </Modal>
  )
}
