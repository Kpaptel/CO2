import Navbar from "../components/Navbar";
import { Link } from 'react-router-dom';

function Home() {
    return (
      <div className="home-container">
        <div className="top-section">
          <div className="left-column">
            <h1 className="main-title">Save the Planet</h1>
            <section className="counter-section">
              <h2>CO2 Counter</h2>
              <div className="counter-value">28:43</div>
            </section>
          </div>
  
          <div className="right-column">
            <section className="emissions-section">
              <h2>Emissions by category</h2>
              <div className="graph-placeholder">[Graph Coming Soon]</div>
            </section>
  
            <section className="top-emitters-section">
              <h2>Top 5 countries emitting the most CO2</h2>
              <div className="countries-list">[Countries list coming soon]</div>
            </section>
          </div>
        </div>
      </div>
    );
}
  
export default Home;