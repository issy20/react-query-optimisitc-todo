import { rest, setupWorker } from 'msw'

import { TodoFormData } from '../hooks/useSaveTodo'
import { Todo, TodoList } from '../models/models'

let id = 10

function genId(prefix: string) {
  return `${prefix}-${id++}`
}

function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

let todoMocks: TodoList = [
  {
    id: 'todo-1',
    task: '掃除',
    importance: 'middle',
  },
  {
    id: 'todo-2',
    task: '書類提出',
    importance: 'high',
  },
]

export const handlers = [
  rest.get('/api/todo', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(todoMocks))
  }),
  rest.post<TodoFormData>('/api/todo', async (req, res, ctx) => {
    const { task, importance } = req.body

    await delay(600)
    const newRecord: Todo = { id: genId('todo'), task, importance }
    if (Math.random() < 0.3) {
      return res(ctx.status(500), ctx.json({ status: 'error' }))
    }
    todoMocks = [newRecord, ...todoMocks]
    return res(ctx.status(200), ctx.json(newRecord))
  }),
]

export const worker = setupWorker(...handlers)
