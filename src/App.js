
import './App.css';

import RootLayout from './Components/RootLayout';
import FacultyDashboard from './Components/FacultyDashboard';
import Uploaddata from './Components/Uploaddata';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Analysedata from './Components/Analysedata';
import Instructions from './Components/Instructions';

function App() {

  const router=createBrowserRouter([
    {
      path:"/",
      element:<RootLayout/>,
      children:[
        {
          path:"/",
          element:<Login/>

        },
        {
          path:"/FacultyDashboard",
          element: <FacultyDashboard/>,
          children:[
            {
              path:'/FacultyDashboard',
              element:<Instructions/>
            },
            {
              path:'/FacultyDashboard/Uploaddata',
              element:<Uploaddata/>
            },
            {
              path:'/FacultyDashboard/Analysedata',
              element:<Analysedata/>
            }
          ]
        },
        {
          path:"/Signup",
          element:<Signup/>
        },
        
      ]


      
      

    }
  ]);

  return (
    <div className="App m-0">
    <RouterProvider router={router} />
    </div>
  );
}

export default App;
