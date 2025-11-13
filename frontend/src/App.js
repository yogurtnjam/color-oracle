import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import LandingPage from './components/LandingPage';
import ConeTest from './components/ConeTest';
import Dashboard from './components/Dashboard';
import PerformanceTest from './components/PerformanceTest';
import ColorSimulator from './components/ColorSimulator';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [coneTestResults, setConeTestResults] = useState(null);

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    if (storedUserId) {
      setUserId(storedUserId);
      setUserName(storedUserName || '');
      // Fetch latest cone test
      fetchLatestConeTest(storedUserId);
    }
  }, []);

  const fetchLatestConeTest = async (uid) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/cone-tests/${uid}/latest`);
      setConeTestResults(response.data);
    } catch (error) {
      console.log('No cone test found');
    }
  };

  const createUser = async (name) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/users`, { name });
      const newUserId = response.data.userId;
      setUserId(newUserId);
      setUserName(name);
      localStorage.setItem('userId', newUserId);
      localStorage.setItem('userName', name);
      return newUserId;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  };

  const saveConeTest = async (results) => {
    if (!userId) return;
    try {
      await axios.post(`${BACKEND_URL}/api/cone-tests`, {
        userId,
        ...results
      });
      setConeTestResults(results);
      fetchLatestConeTest(userId);
    } catch (error) {
      console.error('Error saving cone test:', error);
    }
  };

  const savePerformanceTest = async (testData) => {
    if (!userId) return;
    try {
      await axios.post(`${BACKEND_URL}/api/performance-tests`, {
        userId,
        ...testData
      });
    } catch (error) {
      console.error('Error saving performance test:', error);
    }
  };

  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-nature-sky via-white to-nature-leaf/10">
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage 
                userId={userId}
                userName={userName}
                createUser={createUser}
              />
            } 
          />
          <Route 
            path="/cone-test" 
            element={
              <ConeTest 
                userId={userId}
                saveConeTest={saveConeTest}
              />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <Dashboard 
                userId={userId}
                userName={userName}
                coneTestResults={coneTestResults}
              />
            } 
          />
          <Route 
            path="/performance-test" 
            element={
              <PerformanceTest 
                userId={userId}
                coneTestResults={coneTestResults}
                savePerformanceTest={savePerformanceTest}
              />
            } 
          />
          <Route 
            path="/simulator" 
            element={
              <ColorSimulator 
                coneTestResults={coneTestResults}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
