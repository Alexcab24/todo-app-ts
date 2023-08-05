import { useEffect, useState } from 'react'
import Todos from './components/Todos'
import { FilterValue, TodoTitle, type TodoId, type Todo as TodoType, ListOfTodos } from './types'
import { TODO_FILTERS } from './consts'
import { Footer } from './components/Footer'
import Header from './components/Header'


const mockTodos = [
  {
    id: '1',
    title: 'Tarea de ejemplo',
    completed: false
  }
]

const App = (): JSX.Element => {
  const [todos, setTodos] = useState<ListOfTodos>(() => {

    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : mockTodos;
   
  })
  const [filterSelected, setFilterSelected] = useState<FilterValue>(TODO_FILTERS.ALL)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);


  const handleRemove = ({id}: TodoId) => {
    const newTodos = todos.filter(todo => todo.id != id)
    setTodos(newTodos)
  }

  const handleCompleted = ({id, completed}: Pick<TodoType, 'id' | 'completed'>) => {

    const newTodos = todos.map(todo => {
      if(todo.id === id){
        return {
          ...todo,
          completed
        }
      }
      return todo
    })
    setTodos(newTodos)
  }

  const handleFilterChange = (filter: FilterValue): void => {
    setFilterSelected(filter)
  }

  const handleRemodeAllCompleted = (): void => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const activeCount = todos.filter(todo => !todo.completed).length
  const completedCount = todos.length - activeCount
  const filteredTodos = todos.filter(todo => {
    if(filterSelected === TODO_FILTERS.ACTIVE) return !todo.completed
    if(filterSelected === TODO_FILTERS.COMPLETED) return todo.completed
    return todo
  })

  const handleAddTodo = ({title}: TodoTitle): void => {
const newTodo = {
  title,
  id: crypto.randomUUID(),
  completed: false

}
const newTodos = [...todos, newTodo]
setTodos(newTodos)
  }
  return (
    <>
    <div className = 'todoapp'>
      <Header onAddTodo={handleAddTodo}/>
    <Todos 
    onToggleCompletedTodo = {handleCompleted}
    onRemoveTodo = {handleRemove}
    todos = {filteredTodos}

    />
    <Footer
    onClearCompleted={handleRemodeAllCompleted}
    activeCount={activeCount}
    completedCount={completedCount}
    filterSelected={filterSelected}
    handleFilterChange={handleFilterChange}
    />
    </div>
   
    </>
  )
}

export default App
