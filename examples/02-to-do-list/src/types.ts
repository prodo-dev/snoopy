export type Id = string;

export interface Task {
  id: Id;
  text: string;
  done: boolean;
}

export interface Tasks {
  [id: string]: Task;
}
