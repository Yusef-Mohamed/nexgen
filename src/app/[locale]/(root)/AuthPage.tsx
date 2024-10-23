import Image from "next/image";
import React from "react";
interface AuthPageProps {
  children: React.ReactNode;
  heading: string;
}
const AuthPage: React.FC<AuthPageProps> = ({ children, heading }) => {
  return (
    <main className="relative">
      <Image src="/images/auth-bg.png" fill alt=" s" />
      <div className="w-full px-2 flex items-center justify-center min-h-screen relative">
        <div className="flex items-center justify-center p-6 lg:p-10 rounded-xl w-full">
          <div className="mx-auto w-full md:min-w-[500px] md:max-w-[550px] space-y-6">
            <div className="space-y-2">
              <h1 className="font-semibold text-center text-3xl sm:text-4xl md:text-5xl">
                {heading}
              </h1>
            </div>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
