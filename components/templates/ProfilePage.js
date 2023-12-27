import { useState } from "react"

// icons 
import { CgProfile } from "react-icons/cg"
import ProfileForm from "../modules/ProfileForm";
import axios from "axios";
import { toast } from "react-toastify";

function ProfilePage() {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");

    const submitHandler = async () => {
        try {
            const res = await axios.post("/api/profile", {
                name,
                lastName,
                password
            })
            if (res.data.status === "Success") {
                toast.success("Profile updated successfully")
            }
            console.log(res);
        } catch (err) {
            const errMsg = err.response.data.message;
            toast.error(errMsg);
        }

    }
    return (
        <div className="profile-form">
            <h2><CgProfile /> Profile</h2>
            <ProfileForm name={name} lastName={lastName} password={password} setName={setName} setLastName={setLastName} setPassword={setPassword} submitHandler={submitHandler} />
        </div>
    )
}

export default ProfilePage;