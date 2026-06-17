import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Navbar
        toggleSidebar={() =>
          setIsOpen(!isOpen)
        }
      />

      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <main className="main-content">
        {children}
      </main>
    </>
  );
}