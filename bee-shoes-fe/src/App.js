import { BrowserRouter, Route, Routes } from "react-router-dom";
import { publicRouters } from "./route";
function App() {
  console.log(process.env.API_KEY);
  return (
    <BrowserRouter>
    <Routes>
      {publicRouters.map((route, index) => {
        const Page = route.element
        return <Route exact key={index} path={route.path} element={<Page />}></Route>
      })
      }
    </Routes>
  </BrowserRouter>
  );
}

export default App;
