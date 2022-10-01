import Image from 'next/future/image'
import { signIn, signOut } from 'next-auth/react'
import { PlusIcon } from '@heroicons/react/24/solid'

import useMe from '../hooks/useMe'
import AddGameModal from './AddGameModal'
import useAddGameModalStore from '../stores/addGameModal'

function AuthenticatedUser() {
  const me = useMe()

  if (me.data) {
    return (
      <div className="flex items-center gap-x-5 text-right text-xs font-bold">
        <div className="whitespace-nowrap">
          {me.data.user.name}
          <br />
          <button className="text-xs font-normal" onClick={() => signOut()}>
            Logout
          </button>
        </div>
        {me.data.user.image && me.data.user.name ? (
          <Image
            className="w-6 overflow-hidden rounded-lg"
            width={64}
            height={64}
            src={me.data.user.image}
            alt={me.data.user.name}
          />
        ) : null}
      </div>
    )
  }

  return (
    <button onClick={() => signIn('auth0')} className="flex underline">
      Sign in
    </button>
  )
}

function AddGameButton() {
  const open = useAddGameModalStore((state) => state.open)

  const me = useMe()

  if (me.data && me.data.permissions?.includes('add:game')) {
    return (
      <>
        <button
          onClick={open}
          className="flex rounded-full bg-indigo-500 py-2 px-4 font-bold text-white"
        >
          <PlusIcon className="w-6" />
          Add game
        </button>
        <AddGameModal />
      </>
    )
  }
  return <div></div>
}

export default function Header() {
  return (
    <header className="flex items-center justify-between p-6">
      Klasktoppen We ahead
      <AddGameButton />
      <AuthenticatedUser />
    </header>
  )
}
