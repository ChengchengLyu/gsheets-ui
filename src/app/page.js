"use client";

import LoginForm from "@/components/LoginForm";
import Dashboard from "@/components/Dashboard";
import { useEffect, useState } from "react";

export default function Home() {

  // return <LoginForm />;

  const [token, setToken] = useState("");

  useEffect (() =>{
    const storedToken = localStorage.getItem("authToken");
    if (storedToken){
      setToken(storedToken)
    }
  },[])

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem("authToken", token);
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("authToken");
  }

  return (
  <div>
    {
      !token ? (
        <LoginForm onLogin={handleLogin} />)
      :
        (<Dashboard token={token} onLogout = {handleLogout}/>)
    }
  </div>)

}
