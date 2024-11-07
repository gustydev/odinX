import ErrorPage from './components/errors/ErrorPage'
import App from './App';
import ProtectedRoute from './hooks/useAuth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

const routes = [
    {
      path: '/',
      element: <App/>,
      errorElement: <ErrorPage/>,
      children: [
        { path: '/auth/login', element: <Login />},
        { path: '/auth/register', element: <Register/>},
        { element: <ProtectedRoute/>, children: [
          // { index: true, element: <HomePage/> },
          // { path: '/post/:postId', element: <Post/> },
          // { path: '/user/:userId', element: <User/> },
        ]}
      ]
    }
]

export default routes;