import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotpassword";
import Projects from "./pages/projects";

function App() {

  return (
    <div className="App">
        <Routes>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/signup" element={<Signup />}></Route>
          <Route
            exact
            path="/forgotpassword"
            element={<ForgotPassword />}
          ></Route>
          <Route exact path="/" element={<Projects />}></Route>
          <Route exact path="/home/:projectId" element={<Dashboard />}></Route>
          <Route
            path="*"
            element={
              <div>
                <h1>404 Page not found</h1>
              </div>
            }
          />
        </Routes>
    </div>
  );
}

export default App;
