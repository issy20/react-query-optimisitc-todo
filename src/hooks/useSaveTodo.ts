import { useMutation, useQueryClient } from 'react-query'
import { Todo, TodoList } from '../models/models'
import { cacheKey } from './useFetchTodo'

export type TodoFormData =
  | ({ type: 'New' } & Pick<Todo, 'task' | 'importance'>)
  | ({ type: 'Update' } & Todo)

type Props = {
  onMutate: (todo: Todo) => void
  onSuccess: (todo: Todo) => void
  onError: (todo: Todo) => void
}

let id = 1000

export function useSaveTodo(props: Props) {
  const { onMutate, onSuccess, onError } = props
  const client = useQueryClient()

  return useMutation<Todo, Error, TodoFormData, Todo>(
    async (params) => {
      const res = await fetch('/api/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
      if (res.ok) {
        const json = await res.json()
        return json as Todo
      }
      throw new Error('Something may go wrong')
    },
    {
      onMutate(params) {
        if (params.type === 'Update') {
          const queryData = client.getQueryData<TodoList>(cacheKey)
          if (queryData) {
            const newTodoList = queryData.reduce<TodoList>((p, c) => {
              if (c.id === params.id) {
                return [...p, { ...c, status: 'loading' }]
              }
              return [...p, c]
            }, [])
            client.setQueryData<TodoList>(cacheKey, newTodoList)
          }
          onMutate?.(params)
          return params
        }
        const dataInProgress: Todo = {
          id: `loading-${id++}`,
          status: 'loading',
          ...params,
        }
        client.setQueryData<TodoList>(cacheKey, (previous) =>
          previous ? [dataInProgress, ...previous] : []
        )
        onMutate?.(dataInProgress)
        return dataInProgress
      },
      onSuccess(data, variables, context) {
        if (context) {
          onSuccess(context)
        }
      },
      onError(data, variables, context) {
        if (context) {
          onError(context)
        }
      },
      onSettled() {
        client.invalidateQueries(cacheKey)
      },
    }
  )
}

//reduceとは

// type Student = {
//   name: string;
//   score: number;
// }

// const data: Student[] = [
//   { name: '太郎', score: 75 },
//   { name: '花子', score: 62 },
//   { name: 'John', score: 59 }
// ]
// const scoreList: number[] = data.reduce((acc: number[], val: Student): number[] => {
//   return [...acc, val.score];
// }, []);

// console.log(scoreList); // --> [ 75, 62, 59 ]
