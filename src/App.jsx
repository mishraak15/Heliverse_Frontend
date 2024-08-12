import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Error from "./pages/Error/Error";
import CreateClassroom from "./pages/CreateClassroom/CreateClassroom";
import NewUser from "./pages/NewUser/NewUser";
import Navbar from "./components/Navbar/Navbar";
import EditUser from "./pages/EditUser/EditUser";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createClassroom" element={<CreateClassroom />} />
        <Route
          path="/user/teacher/add"
          element={<NewUser newUserType="Teacher" />}
        />
        <Route
          path="/user/student/add"
          element={<NewUser newUserType="Student" />}
        />
        <Route path="/user/:newUserType/:userid/edit" element={<EditUser />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
