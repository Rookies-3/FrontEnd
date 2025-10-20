import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    username: string;
    email?: string;
    picture?: string;
  }

  
interface UserState {
    isLoggedIn: boolean;
    user ?: User;
    login: (user: User) => void;
    logout: () => void;
}


export const useUserStore = create<UserState>()(
    persist(
      (set) => ({
        isLoggedIn: false,
        user: undefined,
        login: (user) => set({ isLoggedIn: true, user }),
        logout: () => set({ isLoggedIn: false, user: undefined }),
      }),
      {
        name: 'user-storage', // localStorage key
      }
    )
  );
  
  