import AuthProvider from './hooks/useAuth/AuthProvider';
import TopBar from './components/layout/TopBar';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <header>
        <TopBar/>
      </header>
      <main>
        <Outlet></Outlet>
      </main>
    </AuthProvider>
  )
}

export default App
