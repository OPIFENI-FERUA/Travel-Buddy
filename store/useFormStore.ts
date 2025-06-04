// store/useFormStore.ts
import { create } from 'zustand';

// 1. Define interfaces for each section
interface SenderDetails {
  senderName: string;
  senderMobileNumber: string;
  senderLocation: string;
  senderStreet: string;
  senderEstate: string;
}

interface ReceiverDetails {
  receiverName: string;
  receiverMobileNumber: string;
  receiverLocation: string;
  receiverStreet: string;
  receiverEstate: string;
}

interface PackageDetails {
  type: string;
  isFragile: boolean;
  hasTracking: boolean;
  description: string;
  image?: string;
  weight: string;
  deliveryMeans: string;
}

interface FormState {
  sender: SenderDetails;
  receiver: ReceiverDetails;
  packaged: PackageDetails;
}

// 2. Define store actions
interface FormActions {
  updateSender: (data: Partial<SenderDetails>) => void;
  updateReceiver: (data: Partial<ReceiverDetails>) => void;
  updatePackage: (data: Partial<PackageDetails>) => void;
  resetForm: () => void;
  getFormData: () => FormState;
}

// 3. Initial state
const initialState: FormState = {
  sender: {
    senderName: '',
    senderMobileNumber: '',
    senderLocation: '',
    senderStreet: '',
    senderEstate: '',
  },
  receiver: {
    receiverName: '',
    receiverMobileNumber: '',
    receiverLocation: '',
    receiverStreet: '',
    receiverEstate: '',
  },
  packaged: {
    type: '',
    isFragile: false,
    hasTracking: false,
    description: '',
    weight: '',
    deliveryMeans: '',
  },
};

// 4. Create the store
export const useFormStore = create<FormState & FormActions>((set, get) => ({
  ...initialState,

  // Update methods for each section
  updateSender: (data) =>
    set((state) => ({
      sender: { ...state.sender, ...data },
    })),

  updateReceiver: (data) =>
    set((state) => ({
      receiver: { ...state.receiver, ...data },
    })),

  updatePackage: (data) =>
    set((state) => ({
      packaged: { ...state.packaged, ...data },
    })),

  resetForm: () => set(initialState),

  // Helper to get current form data
  getFormData: () => get(),
}));