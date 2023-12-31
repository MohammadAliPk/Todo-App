import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

function GoogleButton() {

    const googleHandler = () => {
        signIn("google");
    }

    return (
        <button onClick={googleHandler} className="google__button"><FcGoogle /> Continue with Google</button>
    )
}

export default GoogleButton