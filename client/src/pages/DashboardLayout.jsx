import React, { createContext, useContext, useState } from "react";
import Wrapper from "../assets/wrappers/Dashboard";
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { BigSidebar, SmallSidebar, Navbar } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async ()=>{
  try {
    const {data} = await customFetch.get('/users/current-user');
    return data;
  } catch (error) {
    return redirect('/');
  }
}

const DashboardContext = createContext();



const DashboardLayout = ({isDarkThemeEnabled}) => {
  const {user} = useLoaderData();
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(isDarkThemeEnabled);

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle('dark-theme',newDarkTheme);
    localStorage.setItem('darkTheme', newDarkTheme);
  };
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const logoutUser = async () => {
    navigate('/');
    await customFetch.get('/auth/logout');
    toast.success('Logged Out')
  };
  return (
    <DashboardContext.Provider
      value={{
        isDarkTheme,
        user,
        showSidebar,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar></SmallSidebar>
          <BigSidebar></BigSidebar>
          <div>
            <Navbar></Navbar>
            <div className="dashboard-page">
              <Outlet context={{user}}/>
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
