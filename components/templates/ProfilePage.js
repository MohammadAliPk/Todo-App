import { useEffect, useState } from "react"

// icons 
import { CgProfile } from "react-icons/cg"
import ProfileForm from "../modules/ProfileForm";
import axios from "axios";
import { toast } from "react-toastify";
import ProfileData from "../modules/ProfileData";

function ProfilePage() {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, [])

    const fetchProfile = async () => {
        const res = await axios.get("/api/profile");
        const data = res.data;

        if (data.status === "Success" && data) {
            setData(data.data);
        }
    }

    const submitHandler = async () => {
        try {
            const res = await axios.post("/api/profile", {
                name,
                lastName,
                password
            })
            if (res.data.status === "Success") {
                toast.success("Profile updated successfully");
                fetchProfile();
            }
        } catch (err) {
            const errMsg = err.response.data.message;
            toast.error(errMsg);
        }

    }
    return (
        <div className="profile-form">
            <h2><CgProfile /> Profile</h2>
            {data ? <>
                <ProfileData data={data} />
                <button onClick={() => setData(null)}>Change</button>
            </> :
                <ProfileForm name={name} lastName={lastName} password={password} setName={setName} setLastName={setLastName} setPassword={setPassword} submitHandler={submitHandler} />
            }
        </div>
    )
}

export default ProfilePage;