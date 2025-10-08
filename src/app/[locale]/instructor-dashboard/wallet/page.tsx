import WalletClient from "./components/WalletClient";

export default function WalletPage() {
  return (
    <main
      style={{
        minHeight: "calc(100vh - 76px)",
      }}
      className="w-full max-w-full bg-background px-2 py-6 overflow-hidden lg:px-6 sm:px-4"
    >
      <WalletClient />
    </main>
  );
}
