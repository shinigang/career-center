import { createSlice } from '@reduxjs/toolkit';

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    items: [],
    totalOpenings: 0,
  },
  reducers: {
    replaceJobs(state, action) {
      const totalOpenings = action.payload.items.reduce((accumulator, job) => {
        return accumulator + job.noOfOpenings;
      }, 0);
      state.totalOpenings = totalOpenings;
      state.items = action.payload.items;
    },
    addJob(state, action) {
      const newItem = action.payload;
      state.changed = true;
      state.items.push({
        id: newItem.id,
        noOfOpenings: newItem.noOfOpenings,
        title: newItem.title,
        description: newItem.description,
        industry: newItem.industry,
      });
      state.totalOpenings += newItem.noOfOpenings;
    },
    removeJob(state, action) {
      const id = action.payload;
      state.changed = true;
      state.items = state.items.filter(item => item.id !== id);
    },
  },
});

export const jobsActions = jobsSlice.actions;

export default jobsSlice;
