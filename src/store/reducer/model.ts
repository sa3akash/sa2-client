import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface FeelingDoc {
  index?: number;
  name: string;
  image: string;
}

export interface ModelState {
  type: string;
  isOpen: boolean;
  feeling: FeelingDoc;
  image: string;
  data: any;
  feelingsIsOpen: boolean;
  openFileDialog: boolean;
  openVideoDialog: boolean;
  gifModalIsOpen: boolean;
  reactionsModalIsOpen: boolean;
  commentsModalIsOpen: boolean;
  deleteDialogIsOpen: boolean;
}

const initialState: ModelState = {
  type: '',
  isOpen: false,
  feeling: { name: '', image: '' },
  image: '',
  data: null,
  feelingsIsOpen: false,
  openFileDialog: false,
  openVideoDialog: false,
  gifModalIsOpen: false,
  reactionsModalIsOpen: false,
  commentsModalIsOpen: false,
  deleteDialogIsOpen: false
};

export const modelSlice = createSlice({
  name: 'model',
  initialState,
  reducers: {
    openModel: (state, action: PayloadAction<ActionData>) => {
      const { type, data } = action.payload;
      state.isOpen = true;
      state.type = type;
      state.data = data;
    },
    closeModel: (state) => {
      state.type = '';
      state.isOpen = false;
      state.feeling = { name: '', image: '' };
      state.image = '';
      state.data = null;
      state.feelingsIsOpen = false;
      state.openFileDialog = false;
      state.openVideoDialog = false;
      state.gifModalIsOpen = false;
      state.reactionsModalIsOpen = false;
      state.commentsModalIsOpen = false;
      state.deleteDialogIsOpen = false;
    },
    addPostFeeling: (state, action: PayloadAction<any>) => {
      state.feeling = action.payload;
    },
    toggleImageModal: (state, action: PayloadAction<boolean>) => {
      state.openFileDialog = action.payload;
    },
    toggleVideoModal: (state, action: PayloadAction<boolean>) => {
      state.openVideoDialog = action.payload;
    },
    toggleFeelingModal: (state, action: PayloadAction<boolean>) => {
      state.feelingsIsOpen = action.payload;
    },
    toggleGifModal: (state, action: PayloadAction<boolean>) => {
      state.gifModalIsOpen = action.payload;
    },
    toggleReactionsModal: (state, action: PayloadAction<boolean>) => {
      state.reactionsModalIsOpen = action.payload;
    },
    toggleCommentsModal: (state, action: PayloadAction<boolean>) => {
      state.commentsModalIsOpen = action.payload;
    },
    toggleDeleteDialog: (state, action: PayloadAction<ActionDeleteData>) => {
      const { toggle, data } = action.payload;
      state.deleteDialogIsOpen = toggle;
      state.data = data;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  openModel,
  closeModel,
  addPostFeeling,
  toggleImageModal,
  toggleVideoModal,
  toggleFeelingModal,
  toggleGifModal,
  toggleReactionsModal,
  toggleCommentsModal,
  toggleDeleteDialog
} = modelSlice.actions;

export default modelSlice.reducer;

interface ActionData {
  type: string;
  data?: any;
}
interface ActionDeleteData {
  toggle: boolean;
  data: any;
}
