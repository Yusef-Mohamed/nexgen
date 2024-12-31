import { Suspense } from "react";
import GetDataFromToken from "./components/GetDataFromToken";

const GoogleCallPack = () => {
  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <Suspense>
        <GetDataFromToken />
      </Suspense>
    </main>
  );
};

export default GoogleCallPack;
