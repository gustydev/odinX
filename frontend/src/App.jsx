import AuthProvider from './hooks/useAuth/AuthProvider';
import TopBar from './components/layout/TopBar';
import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Slide, ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <header>
        <TopBar/>
      </header>
      <main>
        <Outlet></Outlet>
      </main>
      <ToastContainer position='top-center' autoClose={5000} closeOnClick={true} transition={Slide}/>
    </AuthProvider>
  )
}

export default App
