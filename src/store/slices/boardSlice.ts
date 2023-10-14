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
              name: "Create a video for Acme",
              done: true,
              subtasks: {
                [subtaskId]: {
                  id: subtaskId,
                  name: "Subtask example",
                  done: true,
                  subtasks: {},
                },
              },
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
        taskGroup.tasks[newId] = { id: newId, name: taskName, subtasks: {}, done: false };
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

    editSubtaskName: (state, action) => {
      const { workspaceId, taskGroupId, taskId, subtaskId, newName } = action.payload;
      const workspace = state.workspaces[workspaceId];
      const taskGroup = workspace?.taskGroups[taskGroupId];
      const task = taskGroup?.tasks[taskId];
      const subtask = task?.subtasks[subtaskId];

      if (workspace && taskGroup && task && subtask) {
        subtask.name = newName;
      }
    },
    deleteSubtask: (state, action) => {
      const { workspaceId, taskGroupId, taskId, subtaskId } = action.payload;
      const workspace = state.workspaces[workspaceId];
      const taskGroup = workspace?.taskGroups[taskGroupId];
      const task = taskGroup?.tasks[taskId];

      if (workspace && taskGroup && task) {
        delete task.subtasks[subtaskId];
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
    toggleSubtaskState: (state, action) => {
      const { workspaceId, taskGroupId, taskId, subtaskId } = action.payload;
      const workspace = state.workspaces[workspaceId];
      const taskGroup = workspace?.taskGroups[taskGroupId];
      const task = taskGroup?.tasks[taskId];
      const subtask = task?.subtasks[subtaskId];

      if (workspace && taskGroup && task && subtask) {
        subtask.done = !subtask.done;
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
  editSubtaskName,
  deleteSubtask,
  toggleTaskState,
  toggleSubtaskState,
  reorderTaskGroups,
  reorderTasks,
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

export const selectSubtasksForTask = (workspaceId: string, taskGroupId: string, taskId: string) =>
  createSelector(selectTasksForTaskGroup(workspaceId, taskGroupId), (tasks) => {
    const task = tasks[taskId];
    return task ? task.subtasks : {};
  });

export const selectTaskState = (workspaceId: string, taskGroupId: string, taskId: string) =>
  createSelector(selectTasksForTaskGroup(workspaceId, taskGroupId), (tasks) => {
    return tasks[taskId] ? tasks[taskId].done : false;
  });

export const selectSubtaskState = (workspaceId: string, taskGroupId: string, taskId: string, subtaskId: string) =>
  createSelector(selectSubtasksForTask(workspaceId, taskGroupId, taskId), (subtasks) => {
    return subtasks[subtaskId] ? subtasks[subtaskId].done : false;
  });

export const countDoneTasksAndSubtasks = (workspaceId: string, taskGroupId: string) =>
  createSelector(selectTasksForTaskGroup(workspaceId, taskGroupId), (tasks) => {
    let doneTasks = 0;
    let doneSubtasks = 0;

    Object.values(tasks).forEach((task) => {
      if (task.done) {
        doneTasks++;
      }

      Object.values(task.subtasks).forEach((subtask) => {
        if (subtask.done) {
          doneSubtasks++;
        }
      });
    });

    return {
      doneTasks,
      doneSubtasks,
    };
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

export const selectFlattenedTasksWithDepth = (activeWorkspace: string, activeTaskGroup: string) =>
  createSelector(selectWorkspaces, (workspaces) => {
    const flattenedTasks: Array<{
      id: string;
      name: string;
      depth: number;
      parentId: string | null;
    }> = [];

    const extractTasks = (tasks: Record<string, Task>, parentId: string | null, depth: number) => {
      for (const taskId in tasks) {
        const task = tasks[taskId];
        flattenedTasks.push({ ...task, depth, parentId });

        if (task.subtasks) {
          extractTasks(task.subtasks, task.id, depth + 1);
        }
      }
    };

    if (workspaces[activeWorkspace] && workspaces[activeWorkspace].taskGroups[activeTaskGroup]) {
      const tasks = workspaces[activeWorkspace].taskGroups[activeTaskGroup].tasks;
      extractTasks(tasks, null, 0);
    }

    return flattenedTasks;
  });
