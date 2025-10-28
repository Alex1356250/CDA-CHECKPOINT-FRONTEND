import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="header">
      <h1>Checkpoint : frontend</h1>
      <Link to="/Index">Show All Countries</Link> 
      <Link to="/addcountry">Adding a new country</Link>   
    </header>
  );
}
