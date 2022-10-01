import Head from 'next/head'
import Image from 'next/image'
import { TrophyIcon, UserCircleIcon } from '@heroicons/react/24/solid'

import Header from '../components/Header'
import usePlayers from '../hooks/usePlayers'

import type { NextPage } from 'next'
import type { PropsWithChildren } from 'react'

type DataCellProps = PropsWithChildren<{
  colSpan?: number
  center?: boolean
}>

type HeaderCellProps = PropsWithChildren

function HeaderCell({ children }: HeaderCellProps) {
  return <th className="border border-slate-600 p-2">{children}</th>
}

function DataCell({ children, center, colSpan }: DataCellProps) {
  return (
    <td
      colSpan={colSpan}
      className={`border border-slate-600 p-2${center ? ' text-center' : ''}`}
    >
      {children}
    </td>
  )
}

const Home: NextPage = () => {
  const players = usePlayers()

  return (
    <>
      <Head>
        <title>Klasktoppen</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="p-2">
        <table className="w-full table-auto border-collapse border border-slate-500">
          <thead>
            <tr>
              <HeaderCell>Rank</HeaderCell>
              <HeaderCell>Avatar</HeaderCell>
              <HeaderCell>Namn</HeaderCell>
              <HeaderCell>W</HeaderCell>
              <HeaderCell>L</HeaderCell>
              <HeaderCell>W/L</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {players.isLoading ? (
              <tr>
                <DataCell colSpan={6}>Laddar...</DataCell>
              </tr>
            ) : null}

            {players.data?.length === 0 ? (
              <tr>
                <DataCell center colSpan={6}>
                  Inga spelare :(
                </DataCell>
              </tr>
            ) : null}

            {players.data?.map((player, i) => {
              const trophyColor = [
                'text-amber-400',
                'text-gray-300',
                'text-yellow-600	',
              ][i]
              return (
                <tr key={player.id}>
                  <DataCell center>
                    <TrophyIcon className={`${trophyColor} w-16`} />
                  </DataCell>
                  <DataCell>
                    {player.image ? (
                      <Image
                        className="rounded-full"
                        src={player.image}
                        width={48}
                        height={48}
                        alt={`Avatar för ${player.name}`}
                      />
                    ) : (
                      <UserCircleIcon className="h-12 w-12 text-black" />
                    )}
                  </DataCell>
                  <DataCell>{player.name}</DataCell>
                  <DataCell center>{player._count.wonMatches}</DataCell>
                  <DataCell center>{player._count.lostMatches}</DataCell>
                  <DataCell center>
                    {player._count.wonMatches / player._count.lostMatches}
                  </DataCell>
                </tr>
              )
            })}
          </tbody>
        </table>
      </main>
    </>
  )
}

export default Home
