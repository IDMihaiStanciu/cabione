import { create } from 'zustand';

type UIStore = {
  navigation: {
    activeTab: 'design' | 'bomHardware' | 'bomMaterials' | 'url';
    showBomDropdown: boolean;
  };
  loading: {
    design: boolean;
    scene3D: boolean;
    textures: boolean;
    bomHardware: boolean;
    bomMaterials: boolean;
    export: boolean;
  };
  notificationBar: {
    message: string;
    type: 'default' | 'info' | 'success' | 'warning' | 'error';
  };
  errors: {
    validation: Record<string, string>;
    system: string | null;
  };
  setActiveTab: (
    tab: 'design' | 'bomHardware' | 'bomMaterials' | 'url'
  ) => void;
  setShowBomDropdown: (show: boolean) => void;
  setLoading: (key: string, isLoading: boolean) => void;
  setNotificationMessage: (
    message: string,
    type: 'default' | 'info' | 'success' | 'warning' | 'error'
  ) => void;
  setValidationError: (field: string, error: string) => void;
  clearValidationError: (field: string) => void;
  setSystemError: (message: string | null) => void;
};

export const useUIStore = create<UIStore>()((set) => ({
  navigation: {
    activeTab: 'design',
    showBomDropdown: false,
  },
  loading: {
    design: true,
    scene3D: true,
    textures: true,
    bomHardware: true,
    bomMaterials: true,
    export: true,
  },
  notificationBar: {
    message: 'Start here to configure your sideboard',
    type: 'default',
  },
  errors: {
    validation: {},
    system: null,
  },
  setActiveTab: (tab) =>
    set((state) => ({
      ...state,
      navigation: { ...state.navigation, activeTab: tab },
    })),
  setShowBomDropdown: (show) =>
    set((state) => ({
      ...state,
      navigation: { ...state.navigation, showBomDropdown: show },
    })),
  setLoading: (key, isLoading) =>
    set((state) => ({
      ...state,
      loading: {
        ...state.loading,
        [key]: isLoading,
      },
    })),
  setNotificationMessage: (message, type) =>
    set((state) => ({
      ...state,
      notificationBar: {
        ...state.notificationBar,
        message: message,
        type: type,
      },
    })),
  setValidationError: (field, error) =>
    set((state) => ({
      ...state,
      errors: {
        ...state.errors,
        validation: {
          ...state.errors.validation,
          [field]: error,
        },
      },
    })),
  clearValidationError: (field) =>
    set((state) => {
      const { [field]: removed, ...rest } = state.errors.validation;
      return {
        ...state,
        errors: {
          ...state.errors,
          validation: rest,
        },
      };
    }),
  setSystemError: (message) =>
    set((state) => ({
      ...state,
      errors: {
        ...state.errors,
        system: message,
      },
    })),
}));
