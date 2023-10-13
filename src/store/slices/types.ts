import { store } from "../store";

export interface Subtask {
  id: string;
  name: string;
  done: boolean;
}

export interface Task {
  id: string;
  name: string;
  done: boolean;
  subtasks: Record<string, Subtask>;
}

export type TaskGroup = {
  id: string;
  name: string;
  tasks: Record<string, Task>;
};

export type Workspace = {
  id: string;
  name: string;
  taskGroups: Record<string, TaskGroup>;
};

export type BoardState = {
  workspaces: Record<string, Workspace>;
};

export type RootState = ReturnType<typeof store.getState>;
