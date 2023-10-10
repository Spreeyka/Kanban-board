import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workspaces: [
    {
      name: "Acme Corp workspace",
      taskGroups: [{ name: "Working on", tasks: [{ name: "Create a video for acme" }] }],
    },
  ],
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addWorkspace: (state, action) => {
      const newWorkspace = {
        name: action.payload,
        taskGroups: [],
      };

      state.workspaces.push(newWorkspace);
    },
    editWorkspace: (state, action) => {
      const { workspaceIndex, newName } = action.payload;
      if (workspaceIndex >= 0 && workspaceIndex < state.workspaces.length) {
        state.workspaces[workspaceIndex].name = newName;
      }
    },
    deleteWorkspace: (state, action) => {
      const workspaceIndexToDelete = action.payload;

      if (workspaceIndexToDelete >= 0 && workspaceIndexToDelete < state.workspaces.length) {
        state.workspaces.splice(workspaceIndexToDelete, 1);
      }
    },
  },
});

export const { addWorkspace, editWorkspace, deleteWorkspace } = boardSlice.actions;

export const selectWorkspaces = (state) => state.board.workspaces;
