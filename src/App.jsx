import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Create from "./Pages/Create";
import Cart from "./Pages/Cart";
import View from "./Pages/ViewPost";
import { useContext, useEffect } from "react";
import { AuthContext } from "./store/userContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./util/firebase";
import PropTypes from "prop-types";



const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  console.log(user,"saaaaaaaaaass");
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({children}) => {
  const {user} = useContext(AuthContext);
  if(user){
    return <Navigate to={'/'} replace />
  }
  return children;
}

function App() {

  const {setUser} = useContext(AuthContext)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userData) => {
      setUser(userData ? userData : null);
    });

    return () => unsubscribe();
  }, [setUser]);

      const appRouter = createBrowserRouter([
        { 
          path : '/',
          element : (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          )
        },
        {
          path : '/signup',
          element : (
            <PublicRoute>
              <Signup />
             </PublicRoute>
          )
        },
        {
          path : '/login',
          element : (
            <PublicRoute>
              <Login />
            </PublicRoute>
          )
        },
        {
          path : '/create',
          element : (
            <ProtectedRoute>
              <Create />
            </ProtectedRoute>
          )
        },
        {
          path : '/view',
          element : (
            <ProtectedRoute>
            <View/>
            </ProtectedRoute>
          )
        },
        {
          path : '/cart',
          element :(
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          )
        }
      ])

      return <RouterProvider router={appRouter} />
}

export default App;

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
