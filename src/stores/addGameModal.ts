import create from 'zustand'

export type State = {
  isOpen: boolean
}

export type Actions = {
  open: () => void
  close: () => void
}

export type StateWithActions = State & Actions

const useAddGameModalStore = create<StateWithActions>()((set) => {
  return {
    isOpen: false,

    open() {
      set({ isOpen: true })
    },

    close() {
      set({ isOpen: false })
    },
  }
})

export default useAddGameModalStore
