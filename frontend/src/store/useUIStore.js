import { create } from 'zustand';

// --- Enterprise-Grade UI Store with Theme Management ---

// Helper function to get the initial theme
const getInitialTheme = () => {
  // 1. Check for a theme saved in the user's local storage
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme && ['light', 'dark'].includes(storedTheme)) {
    return storedTheme;
  }
  // 2. If no stored theme, check the user's OS preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  // 3. Default to light mode
  return 'light';
};


const useUIStore = create((set) => ({
  // --- State ---
  isSidebarOpen: true,
  theme: getInitialTheme(),

  // --- Actions ---

  /**
   * Toggles the visibility of the main sidebar.
   */
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  /**
   * Sets the application's color theme and persists the choice.
   * @param {'light' | 'dark'} newTheme - The new theme to apply.
   */
  setTheme: (newTheme) => {
    // 1. Update the DOM
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // 2. Save the preference to local storage
    localStorage.setItem('theme', newTheme);
    // 3. Update the state in the store
    set({ theme: newTheme });
  },
}));

// --- Initializer ---
// Apply the initial theme to the body when the app first loads
const initialTheme = useUIStore.getState().theme;
if (initialTheme === 'dark') {
  document.documentElement.classList.add('dark');
}

export default useUIStore;
