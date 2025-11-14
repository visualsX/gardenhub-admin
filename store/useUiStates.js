import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useUiStates = create(
  persist(
    (set) => ({
      //modals states and handler
      isModalOpen: { open: false, data: null },
      openModal: (open, data) => set({ isModalOpen: { open: open, data: data } }),
      closeModal: () => set({ isModalOpen: { isModalOpen: { open: false, data: null } } }),

      //modals states and handler
      isDeleteModalOpen: { open: false, data: null },
      openDeleteModal: (open, data) => set({ isDeleteModalOpen: { open: open, data: data } }),
      closeDeleteModal: () =>
        set({
          isDeleteModalOpen: { isDeleteModalOpen: { open: false, data: null } },
        }),
    }),
    {
      name: 'ui-store', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export default useUiStates;
