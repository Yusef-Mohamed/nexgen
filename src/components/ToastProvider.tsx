"use client";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

const ToastProvider = () => {
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      setTheme(theme);
    }
  }, []);
  return <ToastContainer theme={theme} />;
};

export default ToastProvider;
