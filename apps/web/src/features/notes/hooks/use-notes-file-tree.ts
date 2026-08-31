"use client"

import { create } from "zustand"

type NotesFileTreeState = {
  openFolders: Record<string, boolean>
  toggleFolder: (id: string) => void
  isFolderOpen: (id: string) => boolean
}

export const useNotesFileTree = create<NotesFileTreeState>((set, get) => ({
  openFolders: {},

  toggleFolder: (id) => {
    set((state) => ({
      openFolders: {
        ...state.openFolders,
        [id]: !(state.openFolders[id] !== false),
      },
    }))
  },

  isFolderOpen: (id) => get().openFolders[id] !== false,
}))
