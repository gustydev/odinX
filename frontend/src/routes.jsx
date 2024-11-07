import ErrorPage from './components/errors/ErrorPage'
import App from './App';
import ProtectedRoute from './hooks/useAuth/ProtectedRoute';

const routes = [
    {
      path: '/',
      element: <App/>,
      errorElement: <ErrorPage/>,
      children: [
        // { path: 'login', element: <Login />},
        // { path: 'register', element: <Register/>},
        { element: <ProtectedRoute/>, children: [
          // { index: true, element: <HomePage/> },
          // { path: '/post/:postId', element: <Post/> },
          // { path: '/user/:userId', element: <User/> },
        ]}
      ]
    }
]

export default routes;