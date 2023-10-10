export type Task = {
  name: string;
};

export type TaskGroup = {
  name: string;
  tasks: Task[];
};

export type Workspace = {
  name: string;
  taskGroups: TaskGroup[];
};
