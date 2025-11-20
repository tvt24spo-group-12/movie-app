import { useEffect, useState } from "react"
import "../style/GroupPage.css";
import '../style/global.css';

export default function GroupPage() {
 const [sidebarOpen, setSidebarOpen] = useState(true)

 // Tarkastaa onko sidebar auki vai kiinni ja sen mukaan saadaan säädettyä groupPage:n marginaalit
 useEffect(() => {
    const checkSidebar = () => {
      const el = document.getElementById("sideBar");
      if (!el) return;
      const right = el.style.right;
      if (right === "95%") {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    const interval = setInterval(checkSidebar, 200); // Tarkastaa 200ms välein onko sidebar auki vai kiinni, jos jollakin tähän parempi tapa niin saa muokata
    return () => clearInterval(interval);
  }, []);


  return (
     <div className={sidebarOpen ? "groupPage-wide" : "groupPage-narrow"}>

      <div className="group-layout">

        <div className="group-view">
          <p>Selected group view</p>
        </div>
        
          <div className="group-list">
          <p>Group list</p>
        </div>

      </div>
    </div>
  );
}