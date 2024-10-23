"use client";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { FaSun } from "react-icons/fa";
import { IoMoon } from "react-icons/io5";

const ThemeToggler: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => {
  const { setTheme } = useTheme();

  return (
    <>
      <button
        onClick={() => {
          setTheme("light");
        }}
        className={cn(
          "dark:flex items-center justify-center rounded-full h-[3.25rem] w-[3.25rem] bg-primary-faded hidden",
          className
        )}
        {...props}
      >
        <FaSun />{" "}
      </button>
      <button
        {...props}
        className={cn(
          "dark:hidden items-center justify-center rounded-full h-[3.25rem] w-[3.25rem] bg-primary-faded flex",
          className
        )}
        onClick={() => {
          setTheme("dark");
        }}
      >
        <IoMoon />{" "}
      </button>
    </>
  );
};

export default ThemeToggler;
