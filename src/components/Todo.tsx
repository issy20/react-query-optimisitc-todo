import React, { ChangeEvent, useReducer } from 'react'
import { useFetchTodo } from '../hooks/useFetchTodo'
import { useIncompleteTodo } from '../hooks/useIncompleteTodo'
import { TodoFormData, useSaveTodo } from '../hooks/useSaveTodo'
import { Todo, TodoList } from '../models/models'

type State = Pick<Todo, 'task' | 'importance'>

const initialState: State = {
  task: '',
  importance: '選択してください',
}

type Actions =
  | { type: 'CHANGE_TASK'; task: string }
  | { type: 'CHANGE_IMPORTANCE'; importance: string }
  | { type: 'RESET' }

function reducer(state: State, actions: Actions) {
  switch (actions.type) {
    case 'CHANGE_TASK':
      return { ...state, task: actions.task }
    case 'CHANGE_IMPORTANCE':
      return { ...state, importance: actions.importance }
    case 'RESET':
      return { ...initialState }
  }
}

type UseTodoFormProps = {
  mutate: (formData: TodoFormData) => void
}

export function useTodoForm({ mutate }: UseTodoFormProps) {
  const [formState, dispatch] = useReducer(reducer, initialState)
  const selectProps = {
    value: formState.importance,
    onChange: (e: ChangeEvent<HTMLSelectElement>) =>
      dispatch({
        type: 'CHANGE_IMPORTANCE',
        importance: e.currentTarget.value,
      }),
  }
  const inputProps = {
    value: formState.task,
    onChange: (e: ChangeEvent<HTMLInputElement>) =>
      dispatch({ type: 'CHANGE_TASK', task: e.currentTarget.value }),
  }
  const submitProps = {
    onClick: () => {
      mutate({
        type: 'New',
        task: formState.task,
        importance: formState.importance,
      })
      dispatch({ type: 'RESET' })
    },
    disabled:
      formState.task === '' || formState.importance === '選択してください',
  }
  return {
    selectProps,
    inputProps,
    submitProps,
  }
}

export function TodoForm(props: UseTodoFormProps) {
  const { selectProps, inputProps, submitProps } = useTodoForm(props)
  return (
    <div className="flex pb-12">
      <input
        type="text"
        {...inputProps}
        className="shadow appearance-none border"
      />
      <select {...selectProps} className="">
        <option value="">選択してください</option>
        <option>high</option>
        <option>middle</option>
        <option>low</option>
      </select>
      <button {...submitProps} className="bg-slate-400 rounded-md">
        SUBMIT
      </button>
    </div>
  )
}

type TodoListProps = {
  mutate: (formData: TodoFormData) => void
  incompleteTodoList: TodoList
}

export function TodoListView({ mutate, ...props }: TodoListProps) {
  const { data } = useFetchTodo(props)
  if (!data) return null
  return (
    <ul>
      {data.map((item) => (
        <li
          key={item.id}
          className={item.status === 'failed' ? 'bg-red-400' : ''}
        >
          <div
            className={
              item.status === 'loading' ? 'text-gray-400' : 'text-gray-600'
            }
          >
            {item.status === 'loading' && (
              <div className="flex justify-center">
                <div className="animate-spin h-4 w-4 border-4 border-gray-500 rounded-full border-t-transparent"></div>
              </div>
            )}
            <span className="flex">
              <p className="mr-6">{item.task}</p>
              <p>{item.importance}</p>
            </span>

            {item.status === 'failed' && (
              <span className="flex">
                <p className="mr-6">ERROR</p>
                <button
                  onClick={() => {
                    mutate({ ...item, type: 'Update' })
                  }}
                  className="hover:bg-red-500"
                >
                  RETRY
                </button>
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

function useTodo() {
  const [incompleteTodoList, dispatcher] = useIncompleteTodo()
  const { mutate } = useSaveTodo({
    onMutate(todo) {
      dispatcher.saveLoadingTodo(todo)
    },
    onSuccess(todo) {
      dispatcher.remove(todo)
    },
    onError(todo) {
      dispatcher.updateTodoToError(todo)
    },
  })
  return {
    mutate,
    incompleteTodoList,
  }
}

export const Todos = () => {
  const { mutate, incompleteTodoList } = useTodo()
  return (
    <>
      <TodoForm mutate={mutate} />
      <TodoListView mutate={mutate} incompleteTodoList={incompleteTodoList} />
    </>
  )
}
