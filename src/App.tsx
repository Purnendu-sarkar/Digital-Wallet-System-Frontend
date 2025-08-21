import { Outlet } from "react-router";
import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <h1>Welcome to the Digital Wallet System</h1>
      <p>Your one-stop solution for managing your digital assets.</p>
      <Button>Get Started</Button>
      <Outlet></Outlet>
    </>
  );
}

export default App;
