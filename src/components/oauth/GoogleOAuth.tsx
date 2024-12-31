import {GoogleOAuthProvider, CredentialResponse} from "@react-oauth/google";
import {GoogleLogin} from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";

export default function GoogleOAuth() {
    //todo: change to production url
    //const url = "https://portfolio.mrkb.kr";
    const url = "http://localhost:8080";
    const callback = async (response: CredentialResponse) => {
        if (response.credential) {
            const {email, name, picture}: {email: string, name: string, picture: string} = jwtDecode(response.credential);

            const authData = {
                email: email,
                name: name,
                picture: picture,
            }

            const res = await fetch(`${url}/hanmat/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(authData),
            });
            const data = await res.json();
            if (data.error) {
                console.log(data.error);
                return;
            }
            localStorage.setItem("token", data.data);
            window.location.href = "/";
        }
    }
    return (
        <GoogleOAuthProvider clientId="129739565481-fma8o1vpfnpa3s7vba5hb1gj8bj65146.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={(response) => callback(response)}
                onError={() => console.log("Error")}
            />
        </GoogleOAuthProvider>
    );
}