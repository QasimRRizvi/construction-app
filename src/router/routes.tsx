import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Login from '../pages/Login'
import Plan from '../pages/Plan'
import TaskBoard from '../pages/Taskboard'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/plan' element={<Plan />} />
        <Route path='/tasks' element={<TaskBoard />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes;