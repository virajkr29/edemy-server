import { Context } from "../../context";
import { useContext } from "react";
import AdminNav from "../../components/AdminNav";

const AdminPanel = () =>{
    const {state,dispatch} = useContext(Context)
    const {user} = state;

    return (
        <>
        {
            user && user.role.find(r=> r==="Admin") && (
                <AdminNav />
            )
        }
            <h1 className=" text-center bg-primary jumbotron square">Admin Panel</h1>
            <p>This is the Admin Page </p>
        </>
    )
}

export default AdminPanel;