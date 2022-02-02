export type Todo = {
  id: string
  task: string
  importance: string
  // importance: 'low' | 'middle' | 'high'
  status?: 'loading' | 'failed' | 'done'
}

export type TodoList = ReadonlyArray<Todo>
