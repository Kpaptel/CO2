import { Link } from 'react-router-dom';

function Navbar(){
    return(
        <nav className="nav-bar">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/impact">Impact</Link></li>
                <li><Link to="/your-impact">Your Impact</Link></li>
                <li><Link to="/help">How can you help</Link></li>
              </ul>
        </nav>
    )
}

export default Navbar;