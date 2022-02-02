import { useCallback, useState } from 'react'
import { Todo, TodoList } from '../models/models'

export function useIncompleteTodo() {
  const [state, setState] = useState<TodoList>([])

  const addLoadingTodo = useCallback((todo: Todo) => {
    setState((previous) => [...previous, { ...todo, status: 'loading' }])
  }, [])

  const saveLoadingTodo = useCallback((todo: Todo) => {
    setState((previous) => {
      if (previous.find((item) => item.id === todo.id)) {
        let newTodoList: TodoList = []
        previous.forEach((item) => {
          let newTodo = item
          if (item.id === todo.id) {
            newTodo = { ...newTodo, status: 'loading' }
          }
          newTodoList = [...newTodoList, newTodo]
        })
      }
      return [todo, ...previous]
    })
  }, [])

  const remove = useCallback((todo: Todo) => {
    setState((previous) => {
      return previous.filter((item) => item.id !== todo.id)
    })
  }, [])

  const updateTodoToError = useCallback((todo: Todo) => {
    setState((previous) => {
      let newTodo: TodoList = []
      previous.forEach((item) => {
        let newItem = item
        if (item.id === todo.id) {
          newItem = { ...item, status: 'failed' }
        }
        newTodo = [...newTodo, newItem]
      })
      return newTodo
    })
  }, [])

  return [
    state,
    {
      addLoadingTodo,
      remove,
      updateTodoToError,
      saveLoadingTodo,
    },
  ] as const
}
