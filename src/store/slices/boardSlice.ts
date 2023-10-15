import { createSelector, createSlice } from "@reduxjs/toolkit";
import { BoardState, RootState, Task, TaskGroup } from "./types";
import { v4 as uuidv4 } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";

const workspaceId = uuidv4();
const taskGroupId = uuidv4();
const taskId = uuidv4();
const subtaskId = uuidv4();

const initialState: BoardState = {
  workspaces: {
    [workspaceId]: {
      id: workspaceId,
      name: "Acme Corp workspace",
      taskGroups: {
        [taskGroupId]: {
          id: taskGroupId,
          name: "Working on",
          tasks: {
            [taskId]: {
              id: taskId,
              taskGroupId: taskGroupId,
              name: "Create a video for Acme",
              done: true,
              depth: 0,
              parentId: null,
            },
            [subtaskId]: {
              id: subtaskId,
              taskGroupId: taskGroupId,
              name: "Create a video for Acme",
              done: true,
              depth: 1,
              parentId: taskId,
            },
          },
        },
      },
    },
  },
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addWorkspace: (state, action) => {
      const newWorkspaceId = uuidv4();
      const newWorkspace = {
        id: newWorkspaceId,
        name: action.payload,
        taskGroups: {},
      };

      state.workspaces[newWorkspaceId] = newWorkspace;
    },
    editWorkspace: (state, action) => {
      const { workspaceId, newName } = action.payload;
      state.workspaces[workspaceId].name = newName;
    },
    deleteWorkspace: (state, action) => {
      const workspaceIdToDelete = action.payload;
      if (Object.prototype.hasOwnProperty.call(state.workspaces, workspaceIdToDelete)) {
        delete state.workspaces[workspaceIdToDelete];
      }
    },
    addTaskGroup: (state, action) => {
      const { workspaceId, taskGroupName } = action.payload;
      const workspace = state.workspaces[workspaceId];
      if (workspace) {
        const taskGroupId = uuidv4();
        workspace.taskGroups[taskGroupId] = { id: taskGroupId, name: taskGroupName, tasks: {} };
      }
    },
    editTaskGroupName: (state, action) => {
      const { workspaceId, taskGroupId, newTaskGroupName } = action.payload;
      const workspace = state.workspaces[workspaceId];

      if (workspace && workspace.taskGroups[taskGroupId]) {
        workspace.taskGroups[taskGroupId].name = newTaskGroupName;
      }
    },
    deleteTaskGroup: (state, action) => {
      const { workspaceId, taskGroupId } = action.payload;
      const workspace = state.workspaces[workspaceId];

      if (workspace && workspace.taskGroups[taskGroupId]) {
        delete workspace.taskGroups[taskGroupId];
      }
    },
    addTask: (state, action) => {
      const { workspaceId, taskGroupId, taskName } = action.payload;
      const workspace = state.workspaces[workspaceId];
      const taskGroup = workspace?.taskGroups[taskGroupId];

      if (taskGroup) {
        const newId = uuidv4();
        taskGroup.tasks[newId] = {
          id: newId,
          taskGroupId: taskGroupId,
          name: taskName,
          done: false,
          depth: 0,
          parentId: null,
        };
      }
    },
    deleteTask: (state, action) => {
      const { workspaceId, taskGroupId, taskId } = action.payload;
      if (state.workspaces[workspaceId]) {
        if (state.workspaces[workspaceId].taskGroups[taskGroupId]) {
          const tasks = state.workspaces[workspaceId].taskGroups[taskGroupId].tasks;
          if (tasks[taskId]) {
            delete tasks[taskId];
          }
        }
      }
    },
    editTaskName: (state, action) => {
      const { workspaceId, taskGroupId, taskId, newTaskName } = action.payload;

      if (state.workspaces[workspaceId]?.taskGroups[taskGroupId]?.tasks[taskId]) {
        state.workspaces[workspaceId].taskGroups[taskGroupId].tasks[taskId].name = newTaskName;
      }
    },
    toggleTaskState: (state, action) => {
      const { workspaceId, taskGroupId, taskId } = action.payload;
      const workspace = state.workspaces[workspaceId];
      const taskGroup = workspace?.taskGroups[taskGroupId];
      const task = taskGroup?.tasks[taskId];

      if (workspace && taskGroup && task) {
        task.done = !task.done;
      }
    },
    reorderTaskGroups: (state, action) => {
      const { workspaceId, oldIndex, newIndex } = action.payload;
      const workspace = state.workspaces[workspaceId];
      const taskGroups = workspace.taskGroups;

      const taskGroupsArray = Object.values(taskGroups);
      const reorderedTaskGroupsArray = arrayMove([...taskGroupsArray], oldIndex, newIndex);

      const reorderedTaskGroups = reorderedTaskGroupsArray.reduce((acc: Record<string, TaskGroup>, taskGroup) => {
        acc[taskGroup.id] = taskGroup;
        return acc;
      }, {});

      workspace.taskGroups = reorderedTaskGroups;
    },
    reorderTasks: (state, action) => {
      const { workspaceId, taskGroupId, oldIndex, newIndex } = action.payload;

      const workspace = state.workspaces[workspaceId];
      const taskGroup = workspace.taskGroups[taskGroupId];
      const tasks = taskGroup.tasks;

      const tasksArray = Object.values(tasks);
      const reorderedTasksArray = arrayMove([...tasksArray], oldIndex, newIndex);

      const reorderedTasks = reorderedTasksArray.reduce((acc: Record<string, Task>, task) => {
        acc[task.id] = task;
        return acc;
      }, {});

      taskGroup.tasks = reorderedTasks;
    },
    changeSubtaskParent: (state, action) => {
      const { workspaceId, taskGroupId, sourceTaskId, targetTaskId } = action.payload;

      const workspace = state.workspaces[workspaceId];
      const taskGroup = workspace.taskGroups[taskGroupId];
      const tasks = taskGroup.tasks;

      tasks[sourceTaskId].depth = 0;
      tasks[sourceTaskId].parentId = targetTaskId;
    },
  },
});

export const {
  addWorkspace,
  editWorkspace,
  deleteWorkspace,
  addTaskGroup,
  editTaskGroupName,
  deleteTaskGroup,
  addTask,
  deleteTask,
  editTaskName,
  toggleTaskState,
  reorderTaskGroups,
  reorderTasks,
  changeSubtaskParent,
} = boardSlice.actions;

export const selectWorkspaces = (state: RootState) => state.board.workspaces;

export const selectTasksForTaskGroup = (workspaceId: string, taskGroupId: string) =>
  createSelector(selectWorkspaces, (workspaces) => {
    if (workspaces[workspaceId] && workspaces[workspaceId].taskGroups[taskGroupId]) {
      return workspaces[workspaceId].taskGroups[taskGroupId].tasks;
    } else {
      return {};
    }
  });

export const selectTaskState = (workspaceId: string, taskGroupId: string, taskId: string) =>
  createSelector(selectTasksForTaskGroup(workspaceId, taskGroupId), (tasks) => {
    return tasks[taskId] ? tasks[taskId].done : false;
  });

export const countDoneTasksAndSubtasks = (workspaceId: string, taskGroupId: string) =>
  createSelector(selectTasksForTaskGroup(workspaceId, taskGroupId), (tasks) => {
    let doneTasks = 0;

    Object.values(tasks).forEach((task) => {
      if (task.done) {
        doneTasks++;
      }
    });

    return doneTasks;
  });

export const selectTaskGroupsList = (activeWorkspace: string) =>
  createSelector(selectWorkspaces, (workspaces) => {
    if (workspaces[activeWorkspace]) {
      return Object.values(workspaces[activeWorkspace].taskGroups);
    } else {
      return [];
    }
  });

export const selectTasksList = (activeWorkspace: string, activeTaskGroup: string) =>
  createSelector(selectWorkspaces, (workspaces) => {
    if (workspaces[activeWorkspace] && workspaces[activeWorkspace].taskGroups[activeTaskGroup]) {
      return Object.values(workspaces[activeWorkspace].taskGroups[activeTaskGroup].tasks);
    } else {
      return [];
    }
  });

const getWorkspaceById = (state: RootState, workspaceId: string) => state.board.workspaces[workspaceId];

export const getAllTasksInWorkspace = createSelector([getWorkspaceById], (workspace) => {
  if (workspace && workspace.taskGroups) {
    const allTasks = Object.values(workspace.taskGroups).reduce((tasks: Task[], taskGroup) => {
      if (taskGroup.tasks) {
        return [...tasks, ...Object.values(taskGroup.tasks)];
      }
      return tasks;
    }, []);

    return allTasks;
  }
  return [];
});

export const transformDataSelector = (state: RootState) => {
  const transformedData: { [key: string]: string[] } = {};

  // Loop through workspaces
  for (const workspaceId in state.board.workspaces) {
    const workspace = state.board.workspaces[workspaceId];

    // Loop through task groups in the workspace
    for (const taskGroupId in workspace.taskGroups) {
      const taskGroup = workspace.taskGroups[taskGroupId];
      const taskIds = Object.keys(taskGroup.tasks);

      // Assign the array of task IDs to the corresponding group ID
      transformedData[taskGroupId] = taskIds;
    }
  }

  return transformedData;
};
