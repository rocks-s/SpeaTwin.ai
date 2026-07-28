import "./globals.css";
import NavBar from "../components/nav/NavBar";

export const metadata = {
  title: "Ai avatar",
  description: "Create a digital twin video from your photo and script",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}