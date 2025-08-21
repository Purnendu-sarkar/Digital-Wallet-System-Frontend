import Footer from "./Footer";
import Navbar from "./Navbar";

interface IProps {
  children: React.ReactNode;
}

export default function CommonLayout({ children }: IProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
