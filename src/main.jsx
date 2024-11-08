import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { auth, db, storage } from "./util/firebase.js";
import { FirebaseContext } from "./store/firebaseContext.jsx";
import { CartProvider } from "./store/cartContext.jsx";
import Context from "./store/userContext.jsx";
import Post from "./store/postContext.jsx";
// import MyComponent from "./practise/useMemo.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FirebaseContext.Provider value={{ auth, db, storage }}>
      <CartProvider>
        <Context>
          <Post>
            <App />
          </Post>
        </Context>
      </CartProvider>
    </FirebaseContext.Provider>
  </StrictMode>
  // <MyComponent>

  // </MyComponent>
);
