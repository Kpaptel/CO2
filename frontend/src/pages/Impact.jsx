import { useState } from "react";

function Impact() {
  // State for form inputs and results
  const [fuelType, setFuelType] = useState("Gasoline");
  const [fuelEfficiency, setFuelEfficiency] = useState("");
  const [mileage, setMileage] = useState("");
  const [timeFrame, setTimeFrame] = useState("annual");
  const [result, setResult] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState("");

  // CO2 emission factors (kg CO2 per gallon)
  const emissionFactors = {
    Gasoline: 8.89,
    Diesel: 10.16,
    Hybrid: 6.72,
    Electric: 0.12 // Example (varies by electricity source)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setComparison(null);

    // Validate inputs
    if (!fuelEfficiency || !mileage) {
      setError("Please fill all fields");
      return;
    }

    const mpg = parseFloat(fuelEfficiency);
    const miles = parseFloat(mileage);

    if (isNaN(mpg) || isNaN(miles) || mpg <= 0 || miles < 0) {
      setError("Please enter valid positive numbers");
      return;
    }

    // Calculate base values
    const gallonsUsed = miles / mpg;
    const emissionsKg = gallonsUsed * (emissionFactors[fuelType] || emissionFactors.Gasoline);
    
    // Calculate based on selected time frame
    let divisor;
    switch (timeFrame) {
      case "daily":
        divisor = 365;
        break;
      case "weekly":
        divisor = 52;
        break;
      default: // annual
        divisor = 1;
    }

    const calculatedEmissions = (emissionsKg / divisor).toFixed(2);
    const calculatedMiles = (miles / divisor).toFixed(1);

    // Calculate EV comparison (0.3 kWh/mile is average EV efficiency)
    const evEmissions = miles * 0.3 * emissionFactors.Electric;
    const emissionsSaved = emissionsKg - evEmissions;

    setResult({
      emissions: calculatedEmissions,
      miles: calculatedMiles,
      timeFrame,
      gallonsUsed: gallonsUsed.toFixed(1),
      annualEmissions: emissionsKg.toFixed(2)
    });

    setComparison({
      evEmissions: (evEmissions / divisor).toFixed(2),
      emissionsSaved: (emissionsSaved / divisor).toFixed(2),
      equivalentTrees: Math.round(emissionsSaved / 21.77) // kg CO2 per tree/year
    });
  };

  const handleReset = () => {
    setResult(null);
    setComparison(null);
    setFuelEfficiency("");
    setMileage("");
  };

  return (
    <div className="impact-page" style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      minHeight: 'calc(100vh - 160px)' // Adjust based on your header height
    }}>
      <div className="impact-container" style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px'
      }}>
        {/* Results - appears above form when calculated */}
        {result && (
          <div 
            className="impact-results" 
            style={{
              width: '100%',
              maxWidth: '800px',
              marginTop: '40px',
              animation: 'fadeIn 0.5s ease-out'
            }}
          >
            <div className="result-container">
              <div className="results-grid">
                <div className="current-results">
                  <h3>Your Current Emissions ({result.timeFrame}):</h3>
                  <div className="metrics">
                    <div className="metric">
                      <span className="value">{result.emissions}</span>
                      <span className="unit">kg CO₂</span>
                    </div>
                    <div className="metric">
                      <span className="value">{result.miles}</span>
                      <span className="unit">miles</span>
                    </div>
                  </div>
                  <div className="breakdown">
                    <p>
                      <strong>Annual total:</strong> {result.annualEmissions} kg CO₂
                      ({result.gallonsUsed} {fuelType === "Electric" ? "kWh" : "gallons"})
                    </p>
                  </div>
                </div>

                {comparison && (
                  <div className="ev-comparison">
                    <h3>EV Comparison:</h3>
                    <div className="savings-badge">
                      You could save {comparison.emissionsSaved} kg CO₂/{result.timeFrame}
                    </div>
                    <div className="metrics">
                      <div className="metric">
                        <span className="value">{comparison.evEmissions}</span>
                        <span className="unit">kg CO₂</span>
                      </div>
                    </div>
                    <div className="comparison-details">
                      <p className="fun-fact">
                        Equivalent to planting {comparison.equivalentTrees} trees annually!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form - slides down when results are shown */}
        <div 
          className="impact-form" 
          style={{
            width: '100%',
            maxWidth: '500px',
            marginTop: result ? '0' : '100px',
            transition: 'margin-top 0.5s ease-out',
            marginBottom: '40px'
          }}
        >
          <h2>Vehicle CO₂ Emissions Calculator</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fuelType">Fuel Type:</label>
              <select
                id="fuelType"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
              >
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fuelEfficiency">
                {fuelType === "Electric" ? "Efficiency (kWh/100mi)" : "Fuel Efficiency (MPG)"}
              </label>
              <input
                type="number"
                id="fuelEfficiency"
                value={fuelEfficiency}
                onChange={(e) => setFuelEfficiency(e.target.value)}
                placeholder={fuelType === "Electric" ? "e.g. 30" : "e.g. 25"}
                min="1"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mileage">Miles Driven:</label>
              <input
                type="number"
                id="mileage"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="e.g. 15000"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="timeFrame">Calculate For:</label>
              <select
                id="timeFrame"
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
              >
                <option value="annual">Annual</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ flex: 1 }}>
                {result ? 'Recalculate' : 'Calculate'}
              </button>
              {result && (
                <button 
                  type="button" 
                  onClick={handleReset}
                  style={{
                    flex: 1,
                    background: '#f0f0f0',
                    color: '#333'
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </form>

          {error && <p className="error">{error}</p>}
        </div>
      </div>

      <style jsx>{`
        .impact-page {
          padding-top: 80px;
        }
        
        .impact-form, .impact-results {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        input, select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        button {
          background: #4CAF50;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        button:hover {
          background: #3e8e41;
        }
        
        .error {
          color: red;
          margin-top: 10px;
        }
        
        .result-container {
          margin-top: 20px;
        }
        
        .results-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .current-results,
        .ev-comparison {
          padding: 15px;
          background: #f9f9f9;
          border-radius: 8px;
          margin-bottom: 15px;
        }
        
        .ev-comparison {
          background: #f0f9ff;
          border-left: 4px solid #4CAF50;
        }
        
        .metrics {
          display: flex;
          gap: 10px;
          margin: 15px 0;
        }
        
        .metric {
          text-align: center;
          flex: 1;
        }
        
        .value {
          font-size: 24px;
          font-weight: bold;
          display: block;
        }
        
        .unit {
          color: #666;
        }
        
        .breakdown {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          font-size: 0.9em;
        }
        
        .savings-badge {
          background: #4CAF50;
          color: white;
          padding: 8px;
          border-radius: 4px;
          font-weight: bold;
          margin: 10px 0;
          text-align: center;
          font-size: 0.9em;
        }
        
        .fun-fact {
          font-style: italic;
          color: #666;
          margin-top: 10px;
          font-size: 0.9em;
        }
        
        @media (max-width: 768px) {
          .impact-form {
            margin-top: ${result ? '20px' : '40px'} !important;
            width: 90% !important;
          }
          
          .impact-results {
            width: 90% !important;
          }
          
          .results-grid {
            grid-template-columns: 1fr;
          }
          
          .impact-page {
            padding-top: 60px;
          }
        }
      `}</style>
    </div>
  );
}

export default Impact;