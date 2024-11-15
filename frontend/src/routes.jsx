import ErrorPage from './components/errors/ErrorPage'
import App from './App';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import HomePage from './components/home/HomePage';
import PostPage from './components/post/PostPage';
import Profile from './components/profile/Profile';
import Search from './components/search/Search';

const routes = [
    {
      path: '/',
      element: <App/>,
      errorElement: <ErrorPage/>,
      children: [
        { path: '/auth/login', element: <Login />},
        { path: '/auth/register', element: <Register/>},
        { element: <ProtectedRoute/>, children: [
          { index: true, element: <HomePage/> },
          { path: '/post/:postId', element: <PostPage/> },
          { path: '/user/:userId', element: <Profile/> },
          { path: '/search', element: <Search />}
        ]}
      ]
    }
]

export default routes;