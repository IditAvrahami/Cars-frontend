import React, { useState, useEffect } from 'react';

// Utility function to find the best models in each category
const getBestModels = (data) => {
  if (data.length === 0) return {};

  return {
    fastest: data.reduce((prev, curr) => (prev.top_speed > curr.top_speed ? prev : curr), data[0]),
    agile: data.reduce((prev, curr) => (prev.acceleration < curr.acceleration ? prev : curr), data[0]),
    efficient: data.reduce((prev, curr) => (prev.efficiency < curr.efficiency ? prev : curr), data[0]),
    range: data.reduce((prev, curr) => (prev.range > curr.range ? prev : curr), data[0]),
    battery: data.reduce((prev, curr) => (prev.battery > curr.battery ? prev : curr), data[0]),
  };
};

const BestModels = () => {
  const [bestModels, setBestModels] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch car data from the API
        const response = await fetch('http://localhost:5000/api/cars');
        if (!response.ok) {
          throw new Error('Failed to fetch car data');
        }
        const data = await response.json();

        // Get the best models based on the fetched data
        const best = getBestModels(data);
        console.log("in best model: ", best);
        setBestModels(best);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching car data:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>טוען...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div className="best-models">
      <h2>הדגמים הטובים ביותר</h2>
      <div className="best-model">
        <h3>המהיר ביותר</h3>
        {bestModels.fastest ? (
          <p>{bestModels.fastest.car_name} ({bestModels.fastest.top_speed} km/h)</p>
        ) : (
          <p>מידע לא זמין</p>
        )}
      </div>
      <div className="best-model">
        <h3>האצה המהירה ביותר</h3>
        {bestModels.agile ? (
          <p>{bestModels.agile.car_name} ({bestModels.agile.acceleration} sec 0-100 km/h)</p>
        ) : (
          <p>מידע לא זמין</p>
        )}
      </div>
      <div className="best-model">
        <h3>היעיל ביותר</h3>
        {bestModels.efficient ? (
          <p>{bestModels.efficient.car_name} ({bestModels.efficient.efficiency} kWh/100 km)</p>
        ) : (
          <p>מידע לא זמין</p>
        )}
      </div>
      <div className="best-model">
        <h3>הטווח הארוך ביותר</h3>
        {bestModels.range ? (
          <p>{bestModels.range.car_name} ({bestModels.range.range} km)</p>
        ) : (
          <p>מידע לא זמין</p>
        )}
      </div>
      <div className="best-model">
        <h3>נפח הסוללה הגדול ביותר</h3>
        {bestModels.battery ? (
          <p>{bestModels.battery.car_name} ({bestModels.battery.battery} kWh)</p>
        ) : (
          <p>מידע לא זמין</p>
        )}
      </div>
    </div>
  );
};

export default BestModels;
