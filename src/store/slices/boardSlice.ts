import { arrayMove } from "@dnd-kit/sortable";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { BoardState, RootState, Task, TaskGroup, TransformedData } from "./types";

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
    moveTask: (state, action) => {
      const { workspaceId, sourceGroupId, destinationGroupId, taskId } = action.payload;

      const sourceGroup = state.workspaces[workspaceId].taskGroups[sourceGroupId];
      const destinationGroup = state.workspaces[workspaceId].taskGroups[destinationGroupId];

      if (sourceGroup && destinationGroup) {
        const taskToMove = sourceGroup.tasks[taskId];

        if (taskToMove) {
          taskToMove.taskGroupId = destinationGroupId;
          destinationGroup.tasks[taskId] = { ...taskToMove };

          delete sourceGroup.tasks[taskId];
        }
      }
    },
    moveTaskGroupToNewWorkspace: (state, action) => {
      const { sourceWorkspaceId, targetWorkspaceId, taskGroupId } = action.payload;

      if (sourceWorkspaceId === targetWorkspaceId) return;

      const movedGroup = state.workspaces[sourceWorkspaceId].taskGroups[taskGroupId];

      state.workspaces[targetWorkspaceId].taskGroups[taskGroupId] = { ...movedGroup };
      delete state.workspaces[sourceWorkspaceId].taskGroups[taskGroupId];
    },
    moveTaskToNewWorkspace: (state, action) => {
      const { task, sourceWorkspaceId, targetWorkspaceId } = action.payload;

      if (sourceWorkspaceId === targetWorkspaceId) return;

      const sourceWorkspace = state.workspaces[sourceWorkspaceId];
      const targetWorkspace = state.workspaces[targetWorkspaceId];

      const newGroupName = `${sourceWorkspace.name} tasks`;
      const newGroupId = uuidv4();

      const existingGroup = Object.values(targetWorkspace.taskGroups).find((group) => group.name === newGroupName);

      if (existingGroup) {
        existingGroup.tasks[task.id] = { ...task, taskGroupId: existingGroup.id };
      } else {
        targetWorkspace.taskGroups[newGroupId] = {
          id: newGroupId,
          name: newGroupName,
          tasks: {
            [task.id]: { ...task, taskGroupId: newGroupId },
          },
        };
      }

      delete sourceWorkspace.taskGroups[task.taskGroupId].tasks[task.id];

      const groupIsEmptyAfterMove = Object.keys(sourceWorkspace.taskGroups[task.taskGroupId].tasks).length === 0;
      if (groupIsEmptyAfterMove) {
        delete sourceWorkspace.taskGroups[task.taskGroupId];
      }
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
  moveTask,
  moveTaskToNewWorkspace,
  moveTaskGroupToNewWorkspace,
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

export const transformDataSelector = createSelector([selectWorkspaces], (workspaces) => {
  const transformedData: TransformedData = {};

  for (const workspaceId in workspaces) {
    const workspace = workspaces[workspaceId];

    for (const taskGroupId in workspace.taskGroups) {
      const taskGroup = workspace.taskGroups[taskGroupId];
      const taskIds = Object.keys(taskGroup.tasks);

      transformedData[taskGroupId] = taskIds;
    }
  }

  return transformedData;
});
