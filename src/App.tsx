import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import './App.css'
import { Todos } from './components/Todo'

const client = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={client}>
      <div className="items-center min-h-screen flex flex-col font-mono text-sm text-gray-600 justify-center">
        <Todos />
      </div>
    </QueryClientProvider>
  )
}

export default App
