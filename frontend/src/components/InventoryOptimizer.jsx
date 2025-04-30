import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import '../App.css';

const InventoryOptimizer = () => {
  const [isProbabilistic, setIsProbabilistic] = useState(true);
  const [demandData, setDemandData] = useState([]);
  const [optimizedResult, setOptimizedResult] = useState(null);

  // EOQ parameter states
  const [demand, setDemand] = useState(1200); // Annual demand (D)
  const [orderCost, setOrderCost] = useState(50); // Ordering cost (S)
  const [holdingCost, setHoldingCost] = useState(5); // Holding cost (H)

  useEffect(() => {
    const generateData = () => {
      const data = [];
      for (let i = 0; i < 12; i++) {
        const base = demand / 12;
        const variation = isProbabilistic ? Math.floor(Math.random() * 50) : 0;
        data.push({ month: `Month ${i + 1}`, demand: base + variation });
      }
      setDemandData(data);
    };

    generateData();
  }, [isProbabilistic, demand]);

  const handleOptimize = () => {
    const eoq = Math.sqrt((2 * demand * orderCost) / holdingCost);
    setOptimizedResult(Math.round(eoq));
  };

  return (
    <div className="chart-container">
      <h2>Inventory Optimizer</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="checkbox"
            checked={isProbabilistic}
            onChange={() => setIsProbabilistic(!isProbabilistic)}
          />
          {' '}Probabilistic Demand
        </label>
      </div>

      <div className="toggle-info">
        {isProbabilistic ? (
          <p>You are currently using the <strong>probabilistic</strong> demand model.</p>
        ) : (
          <p>You are currently using the <strong>deterministic</strong> demand model.</p>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>EOQ Parameters</h3>
        <div>
          <label>Annual Demand (D): </label>
          <input
            type="number"
            value={demand}
            onChange={(e) => setDemand(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>Ordering Cost (S): </label>
          <input
            type="number"
            value={orderCost}
            onChange={(e) => setOrderCost(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>Holding Cost (H): </label>
          <input
            type="number"
            value={holdingCost}
            onChange={(e) => setHoldingCost(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <button onClick={handleOptimize} style={{ marginTop: '20px' }}>
        Optimize Inventory
      </button>

      {optimizedResult && (
        <div style={{ marginTop: '20px', fontSize: '1.2rem' }}>
           Recommended EOQ: <strong>{optimizedResult}</strong> units
        </div>
      )}
     
      <h3>Monthly Demand Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={demandData} margin={{ top: 10, right: 20, left: 30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="demand" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

  
    </div>
  );
};

export default InventoryOptimizer;