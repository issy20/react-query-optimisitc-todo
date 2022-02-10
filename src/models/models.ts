export type Todo = {
  id: string
  task: string
  importance: string
  status?: 'loading' | 'failed' | 'done'
}

export type TodoList = ReadonlyArray<Todo>
