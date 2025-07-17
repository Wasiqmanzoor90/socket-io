import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/user/login';
import Register from './pages/user/register';
import AllUser from './pages/messages/allUser';
import Chat from './pages/messages/chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/register' element={<Register/>}/>
        <Route path='/users' element={<AllUser/>}/>
      <Route path="/chat/:id" element={<Chat />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
