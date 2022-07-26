import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UniversitiesEntity } from './universities.type';

export type UniversitiesState = UniversitiesEntity[];

const initialState: UniversitiesState = [];

export const universitiesSlice = createSlice({
  name: 'universities',
  initialState,
  reducers: {
    setUniversitiesByCountry: (state, action: PayloadAction<UniversitiesState>) => {
      state = [...action.payload]
      return state
    },
  },
})

export const {
  setUniversitiesByCountry,
} = universitiesSlice.actions;

export const universitiesReducer = universitiesSlice.reducer;