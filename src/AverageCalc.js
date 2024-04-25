import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AverageCalculator = () => {
  const [numbers, setNumbers] = useState([]);
  const [average, setAverage] = useState(null);
  const [windowSize, setWindowSize] = useState(100);
  const [prevNumbers, setPrevNumbers] = useState([]);
  const [prevAverage, setPrevAverage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNumbers = async (numberID) => {
    try {
      setLoading(true);
      const start = performance.now();
      const response = await axios.get(`http://20.244.56.144/test/${numberID}`);
      const end = performance.now();

      if (end - start > 500) {
        console.log('Request took too long, ignoring response');
        setLoading(false);
        return;
      }

      const newNumbers = response.data;
      const uniqueNewNumbers = [...new Set([...numbers, ...newNumbers])];
      const windowedNumbers = uniqueNewNumbers.slice(-windowSize);
      setPrevNumbers(numbers);
      setPrevAverage(average);
      setNumbers(windowedNumbers);

      if (windowedNumbers.length === windowSize) {
        const sum = windowedNumbers.reduce((a, b) => a + b, 0);
        setAverage(sum / windowSize);
      } else {
        setAverage(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching numbers:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const numberIDs = ['Pf', 'fe', 'er', 'r'];
    const fetchNumbersInterval = setInterval(() => {
      const randomNumberID = numberIDs[Math.floor(Math.random() * numberIDs.length)];
      fetchNumbers(randomNumberID);
    }, 1000);

    return () => clearInterval(fetchNumbersInterval);
  }, []);

  const handleWindowSizeChange = (event) => {
    const newWindowSize = parseInt(event.target.value);
    setWindowSize(newWindowSize);
  };

  return (
    <div>
      <h1>Average Calculator</h1>
      <div>
        <label htmlFor="windowSize">Window Size:</label>
        <input
          type="number"
          id="windowSize"
          value={windowSize}
          onChange={handleWindowSizeChange}
          min="1"
        />
      </div>
      <p>Previous Numbers: {prevNumbers.join(', ')}</p>
      <p>Previous Average: {prevAverage !== null ? prevAverage.toFixed(2) : 'N/A'}</p>
      <p>Current Numbers: {numbers.join(', ')}</p>
      <p>Current Average: {average !== null ? average.toFixed(2) : 'N/A'}</p>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default AverageCalculator;