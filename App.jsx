import React, { useState } from 'react';
import axios from 'axios';

const WINDOW_SIZE = 10;

const AverageCalculator = () => {
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [windowCurrState, setWindowCurrState] = useState([]);
  const [avg, setAvg] = useState(0);

  const fetchNumbers = async (numberId) => {
    const urlMap = {
      p: 'http://20.244.56.144/test/primes',
      f: 'http://20.244.56.144/test/fibo',
      e: 'http://20.244.56.144/test/fibo',
      r: 'http://20.244.56.144/test/rand',
    };

    try {
      const response = await axios.get(urlMap[numberId], { timeout: 500 });
      const newNumbers = response.data.numbers.filter(num => !windowCurrState.includes(num));

      let updatedWindow = [...windowCurrState, ...newNumbers];
      if (updatedWindow.length > WINDOW_SIZE) {
        updatedWindow = updatedWindow.slice(-WINDOW_SIZE);
      }

      setWindowPrevState(windowCurrState);
      setWindowCurrState(updatedWindow);
      setAvg(calculateAverage(updatedWindow));
    } catch (error) {
      console.error('Error fetching numbers:', error);
    }
  };

  const calculateAverage = (numbers) => {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return (sum / numbers.length).toFixed(2);
  };

  return (
    <div>
      <h1>Average Calculator Microservice</h1>
      <button onClick={() => fetchNumbers('p')}>Fetch Primes</button>
      <button onClick={() => fetchNumbers('f')}>Fetch Fibonacci</button>
      <button onClick={() => fetchNumbers('e')}>Fetch Even</button>
      <button onClick={() => fetchNumbers('r')}>Fetch Random</button>
      <div>
        <h2>Previous Window State: {JSON.stringify(windowPrevState)}</h2>
        <h2>Current Window State: {JSON.stringify(windowCurrState)}</h2>
        <h2>Average: {avg}</h2>
      </div>
    </div>
  );
};

export default AverageCalculator;