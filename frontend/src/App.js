import "./style/App.css";
import "./style/intheaters.css";
import "./style/global.css";
import { useAuth } from "./context/login";
import SideBar from "./components/sidebar";
import Router from "./routes/Router";
import { SidebarProvider, useSidebar } from "./context/sidebar";

function AppContent() {
  const { sidebar, setSidebar } = useSidebar();
  
  return (
    <>
      <SideBar sidebar={sidebar} setsidebar={setSidebar} />
      <Router />
    </>
  );
}

function App() {
  return (
    <SidebarProvider>
      <AppContent />
    </SidebarProvider>
  );
}

export default App;
