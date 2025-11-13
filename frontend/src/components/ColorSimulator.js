import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Home, Palette, Info, Leaf, Sun, Droplet } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function ColorSimulator({ coneTestResults }) {
  const navigate = useNavigate();
  const [adaptedMode, setAdaptedMode] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coneTestResults && adaptedMode) {
      fetchRecommendations();
    }
  }, [coneTestResults, adaptedMode]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/color-adaptation`, {
        lCone: coneTestResults.lCone,
        mCone: coneTestResults.mCone,
        sCone: coneTestResults.sCone
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyColorAdaptation = (rgb, adjustments) => {
    if (!adjustments || !adaptedMode) return rgb;
    
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    const newR = Math.min(255, Math.floor(r * adjustments.redAdjustment * adjustments.contrastBoost));
    const newG = Math.min(255, Math.floor(g * adjustments.greenAdjustment * adjustments.contrastBoost));
    const newB = Math.min(255, Math.floor(b * adjustments.blueAdjustment * adjustments.contrastBoost));
    return `rgb(${newR}, ${newG}, ${newB})`;
  };

  const sampleColors = [
    { name: 'Forest Green', rgb: 'rgb(34, 139, 34)', icon: Leaf },
    { name: 'Sky Blue', rgb: 'rgb(135, 206, 235)', icon: Sun },
    { name: 'Sunset Orange', rgb: 'rgb(255, 179, 71)', icon: Sun },
    { name: 'Ocean Blue', rgb: 'rgb(74, 144, 164)', icon: Droplet },
    { name: 'Moss Green', rgb: 'rgb(74, 124, 35)', icon: Leaf },
    { name: 'Earth Brown', rgb: 'rgb(139, 115, 85)', icon: null },
    { name: 'Rose Red', rgb: 'rgb(255, 107, 107)', icon: null },
    { name: 'Lavender', rgb: 'rgb(181, 126, 220)', icon: null },
    { name: 'Coral', rgb: 'rgb(255, 127, 80)', icon: null },
  ];

  if (!coneTestResults) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md text-center">
          <Palette size={64} className="text-nature-forest mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-nature-forest mb-4">
            No Cone Test Results
          </h2>
          <p className="text-gray-700 mb-6">
            Please complete the cone contrast test first to use the color simulator.
          </p>
          <button
            onClick={() => navigate('/cone-test')}
            className="btn-nature text-white font-bold px-8 py-3 rounded-full mb-3"
          >
            Take Cone Test
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="block w-full text-nature-moss hover:text-nature-forest transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-nature-forest hover:text-nature-moss mb-6 transition-colors"
          >
            <Home size={20} />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="glass-card rounded-3xl p-8 mb-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl">
                  <Palette size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-nature-forest mb-2">
                    Color Simulator
                  </h1>
                  <p className="text-gray-600">
                    See how colors adapt to your vision profile
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setAdaptedMode(!adaptedMode)}
                className={`px-8 py-4 rounded-full font-bold text-lg transition-all ${
                  adaptedMode
                    ? 'bg-nature-leaf text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                data-testid="toggle-adaptation-btn"
              >
                {adaptedMode ? 'Adapted Mode ON' : 'Adapted Mode OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations Panel */}
        {adaptedMode && recommendations && (
          <div className="glass-card rounded-2xl p-6 mb-8 bg-nature-leaf/10 border-2 border-nature-leaf animate-fadeIn">
            <div className="flex items-start gap-3">
              <Info size={24} className="text-nature-forest flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-nature-forest mb-2">
                  Color Adaptations Applied
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  {recommendations.recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Color Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {sampleColors.map((color, index) => {
            const displayColor = adaptedMode && recommendations
              ? applyColorAdaptation(color.rgb, recommendations)
              : color.rgb;
            
            const Icon = color.icon;
            
            return (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 card-hover animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className="w-full h-40 rounded-xl mb-4 shadow-inner flex items-center justify-center transition-all duration-300"
                  style={{ backgroundColor: displayColor }}
                >
                  {Icon && <Icon size={48} className="text-white opacity-50" />}
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-nature-forest mb-2">
                    {color.name}
                  </h3>
                  <div className="text-xs font-mono text-gray-500 space-y-1">
                    <div>Original: {color.rgb}</div>
                    {adaptedMode && displayColor !== color.rgb && (
                      <div className="text-nature-leaf font-semibold">
                        Adapted: {displayColor}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Nature Scene Example */}
        <div className="mt-12 glass-card rounded-3xl p-8 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-2xl font-bold text-nature-forest mb-6 text-center">
            Nature Scene Simulation
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-center font-semibold text-gray-600 mb-4">Original Colors</p>
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-200"></div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-600 to-green-400"></div>
                <div className="absolute bottom-16 left-1/4 w-16 h-24 bg-gradient-to-t from-green-800 to-green-600 rounded-t-full"></div>
                <div className="absolute bottom-16 right-1/3 w-20 h-28 bg-gradient-to-t from-green-800 to-green-600 rounded-t-full"></div>
                <div className="absolute top-8 right-12 w-16 h-16 bg-yellow-300 rounded-full shadow-lg"></div>
              </div>
            </div>
            
            <div>
              <p className="text-center font-semibold text-gray-600 mb-4">
                {adaptedMode ? 'Adapted Colors' : 'Adapted Colors (Turn ON)'}
              </p>
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-xl">
                <div 
                  className="absolute inset-0 bg-gradient-to-b"
                  style={{
                    backgroundImage: adaptedMode && recommendations
                      ? `linear-gradient(to bottom, ${applyColorAdaptation('rgb(96, 165, 250)', recommendations)}, ${applyColorAdaptation('rgb(191, 219, 254)', recommendations)})`
                      : 'linear-gradient(to bottom, rgb(96, 165, 250), rgb(191, 219, 254))'
                  }}
                ></div>
                <div 
                  className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t"
                  style={{
                    backgroundImage: adaptedMode && recommendations
                      ? `linear-gradient(to top, ${applyColorAdaptation('rgb(22, 101, 52)', recommendations)}, ${applyColorAdaptation('rgb(74, 222, 128)', recommendations)})`
                      : 'linear-gradient(to top, rgb(22, 101, 52), rgb(74, 222, 128))'
                  }}
                ></div>
                <div 
                  className="absolute bottom-16 left-1/4 w-16 h-24 rounded-t-full"
                  style={{
                    backgroundColor: adaptedMode && recommendations
                      ? applyColorAdaptation('rgb(22, 101, 52)', recommendations)
                      : 'rgb(22, 101, 52)'
                  }}
                ></div>
                <div 
                  className="absolute bottom-16 right-1/3 w-20 h-28 rounded-t-full"
                  style={{
                    backgroundColor: adaptedMode && recommendations
                      ? applyColorAdaptation('rgb(22, 101, 52)', recommendations)
                      : 'rgb(22, 101, 52)'
                  }}
                ></div>
                <div 
                  className="absolute top-8 right-12 w-16 h-16 rounded-full shadow-lg"
                  style={{
                    backgroundColor: adaptedMode && recommendations
                      ? applyColorAdaptation('rgb(253, 224, 71)', recommendations)
                      : 'rgb(253, 224, 71)'
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-600 mt-6">
            Toggle "Adapted Mode" to see how colors are personalized based on your cone sensitivity results
          </p>
        </div>
      </div>
    </div>
  );
}

export default ColorSimulator;
