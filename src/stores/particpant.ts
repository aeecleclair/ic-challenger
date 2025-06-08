import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Participant } from "../api/hyperionSchemas";

interface ParticipantStore {
  participant?: Participant;
  setParticipant: (participant?: Participant) => void;
  resetParticipant: () => void;
}

export const useParticipantStore = create<ParticipantStore>()(
  devtools(
    persist(
      (set) => ({
        participant: undefined,
        setParticipant: (participant?: Participant) => {
          set({ participant: participant });
        },
        resetParticipant: () => {
          set({ participant: undefined });
        },
      }),
      {
        name: "raid-participant-storage",
      },
    ),
  ),
);
