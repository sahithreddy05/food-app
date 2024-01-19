import React, { lazy, Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/Header";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
// import About from "./components/About";
import Contact from "./components/Contact";
import RestaurantMenu from "./components/RestaurantMenu";
import Error from "./components/Error";
import Body from "./components/Body";
import UserContext from "./utils/UserContext";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Cart from "./components/Cart";


// Chunking
// Code Splitting
// Dynamic Bundling
// lazy Loading
// on demand loading
// dynamix imoprt


const Grocery = lazy(() => import("./components/Grocery.jsx"));

const About = lazy(() => import("./components/About.jsx"));

const AppLayout = () => {
  const [userName, setUserName] = useState();


  //authentication
  useEffect(() => {
    // Make an API call and send username and password
    const data = {
      name: "Sahith Reddy",
    };
    setUserName(data.name);
  }, []);

  return (
    // <UserContext.Provider value={{ loggedInUser: userName, setUserName }}>
    //   <div className="app">
    //     <Header />
    //     <Outlet />
    //   </div>
    // </UserContext.Provider>
    <Provider store={appStore}>
    <UserContext.Provider value={{ loggedInUser: userName, setUserName }}>
      <div className="app">
        <Header />
        <Outlet />
      </div>
    </UserContext.Provider>
  </Provider>
  );
};

//import Grocery from "./components/Grocery";

// Chunking
// Code Splitting
// Dynamic Bundling
// lazy Loading
// on demand loading
// dynamix imoprt



// Define your router outside of the AppLayout component
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Body />, // Ensure Body is imported
      },
      {
        path: "/about",
        element: (
          <Suspense fallback={<h1>Loading....</h1>}>
            <About />
          </Suspense>
        ),
      },
      {
        path: "/grocery",
        element: (
          <Suspense fallback={<h1>Loading....</h1>}>
            <Grocery />
          </Suspense>
        ),
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/restaurants/:resId",
        element: <RestaurantMenu />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
    ],
    errorElement: <Error />,
  },
]);

// Export AppLayout wrapped with RouterProvider for use in your main entry file (like index.js)
export const App = () => (
  <RouterProvider router={appRouter} />
);

// Alternatively, if you only want to export the AppLayout without the router, simply do:
// export default AppLayout;
