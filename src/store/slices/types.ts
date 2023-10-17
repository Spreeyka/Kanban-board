import { store } from "../store";

export type TransformedData = {
  [taskGroupId: string]: string[];
};
export interface Task {
  id: string;
  taskGroupId: string;
  name: string;
  done: boolean;
  depth: number;
  parentId: string | null;
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
