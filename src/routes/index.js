import { Route, Routes } from "react-router-dom";
import Admin from "../pages/admin";
import Home from "../pages/home";
import Private from "../pages/private";
import Register from "../pages/register";


function RoutesApp() {
    return (

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Private><Admin/></Private>} />
        </Routes>

    )
}


export default RoutesApp;