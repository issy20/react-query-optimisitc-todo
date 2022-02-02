import { useEffect, useRef } from 'react'
import { useQuery } from 'react-query'
import { Todo, TodoList } from '../models/models'

export const cacheKey = 'todo'

type UseFetchMixedTodoProps = {
  incompleteTodoList?: TodoList
}
type ServerResponseTodo = Omit<Todo, 'status'>

export function useFetchTodo({ incompleteTodoList }: UseFetchMixedTodoProps) {
  //incompleteTodoListがnullまたはundefinedの時、空の配列を返す
  const ref = useRef<TodoList>(incompleteTodoList ?? [])
  useEffect(() => {
    ref.current = incompleteTodoList ?? []
  }, [incompleteTodoList])

  return useQuery(cacheKey, async () => {
    console.log('test')
    const res = await fetch('api/todo')
    if (res.ok) {
      const json = await res.json()
      const incompleteData = ref.current ?? []
      const completeData = (json as ReadonlyArray<ServerResponseTodo>).map(
        (item) => ({
          ...item,
          status: 'done',
        })
      )
      return [...incompleteData, ...completeData] as TodoList
    }
    throw new Error('Something may go wrong')
  })
}
