import { Route, Routes } from 'react-router-dom';
import './App.css';
import Signin from './componets/signin/signin';
import Signup from './componets/signup/signup';
import Chat from './componets/chat/chat';
import ProtectedRoute from './componets/protectedRoute';

function App() {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/signIn" element={<Signin/>} />
      <Route path="/chat" element={ <ProtectedRoute><Chat/></ProtectedRoute>}/> 
    </Routes>
    </div>
  );
}

export default App;
