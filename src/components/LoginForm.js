
"use client"; // it default to work as server, here we're claiming using for client

import { useState } from "react";
import { API_BASE_URL } from "@/constants";

const LoginForm = ({onLogin}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");

    /* From the api, when try successfully username and password, shown in "Curl"
    curl -X 'POST' \
    'https://google-sheets-python-api-ten.vercel.app/token' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d 'grant_type=password&username=admin&password=secretpsw123&scope=&client_id=string&client_secret=string' */

    const handleLogin = async () => {
        setIsLoading(true);
        try{
            const response = await fetch(
                `${API_BASE_URL}/token`, {
                    method: "POST",
                    headers:{
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `grant_type=password&username=${username}&password=${password}&scope=&client_id=string&client_secret=string`
                }
            );

            const data = await response.json();
            if (!response.ok){
                throw new Error(data.detail | "Failed to login");
            }
            console.log(data);
            onLogin(data.access_token);
            setLoginError("");

        } catch(error){
            console.log("An error occurred while attempting to login");
            setLoginError("An error occurred while attempting to login");
        }
        setIsLoading(false);
    };

    return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

        <div className="bg-white p-8 rounded-lg shadow-md">
            <h1
            className="text-2x1 font-bold mb-4"
            >
                Login</h1>
            <input type = "text" placeholder="Username"
            value = {username}
            onChange={e => setUsername(e.target.value)
            }
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input type = "password" placeholder="Password"
            value = {password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600"
            >
                {isLoading ? "Loading..." : "Login"}
            </button>
            
            {loginError && <p className = "text-red-500 mt-2"> {loginError}</p>}
        </div>
    </div>);
    
};

export default LoginForm;
