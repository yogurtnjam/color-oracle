import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Leaf, Trees, Mountain, Sun } from 'lucide-react';

function LandingPage({ userId, userName, createUser }) {
  const [name, setName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    if (userId) {
      navigate('/dashboard');
    } else {
      setShowNameInput(true);
    }
  };

  const handleSubmitName = async (e) => {
    e.preventDefault();
    console.log('Submit button clicked, name:', name);
    
    if (name.trim()) {
      console.log('Creating user...');
      try {
        const newUserId = await createUser(name);
        console.log('User created with ID:', newUserId);
        
        if (newUserId) {
          console.log('Navigating to dashboard...');
          navigate('/dashboard');
        } else {
          console.error('Failed to create user - no userId returned');
        }
      } catch (error) {
        console.error('Error creating user:', error);
      }
    } else {
      console.log('Name is empty, not submitting');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 opacity-20 animate-float">
          <Trees size={80} className="text-nature-forest" />
        </div>
        <div className="absolute top-20 right-20 opacity-20 float-slow" style={{ animationDelay: '1s' }}>
          <Leaf size={60} className="text-nature-leaf" />
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
          <Mountain size={70} className="text-nature-moss" />
        </div>
        <div className="absolute top-1/3 right-10 opacity-30">
          <Sun size={100} className="text-nature-sunrise animate-pulse-slow" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <header className="text-center mb-16 animate-fadeIn">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-nature-forest to-nature-leaf p-4 rounded-full shadow-2xl">
              <Eye size={48} className="text-white" />
            </div>
          </div>
          <h1 className="logo-font text-4xl md:text-6xl font-bold text-nature-forest mb-4">
            OPHTHALMOS
          </h1>
          <p className="text-xl md:text-2xl text-nature-moss font-medium">
            Your Personal Color Vision Enhancement App
          </p>
        </header>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="glass-card rounded-3xl p-8 md:p-12 text-center animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-nature-forest mb-6">
              See the World in Full Color
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              Experience personalized color vision enhancement through advanced cone contrast testing 
              and adaptive color rendering. Inspired by the beauty of nature.
            </p>
            
            {!showNameInput ? (
              <button
                onClick={handleGetStarted}
                className="btn-nature text-white font-bold text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
                data-testid="get-started-btn"
              >
                {userId ? `Welcome back, ${userName}!` : 'Get Started'}
              </button>
            ) : (
              <form onSubmit={handleSubmitName} className="max-w-md mx-auto">
                <div className="mb-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-6 py-4 text-lg rounded-full border-2 border-nature-leaf focus:outline-none focus:border-nature-forest transition-colors"
                    autoFocus
                    data-testid="name-input"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-nature text-white font-bold text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
                  data-testid="submit-name-btn"
                >
                  Continue
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="glass-card rounded-2xl p-8 text-center card-hover animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="bg-gradient-to-br from-nature-sky to-nature-ocean w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Eye size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-nature-forest mb-3">
              Cone Contrast Test
            </h3>
            <p className="text-gray-700">
              Measure your L, M, and S cone sensitivities with our scientifically-designed test
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 text-center card-hover animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <div className="bg-gradient-to-br from-nature-leaf to-nature-moss w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Trees size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-nature-forest mb-3">
              Adaptive Rendering
            </h3>
            <p className="text-gray-700">
              Personalized color adjustments based on your unique cone sensitivity profile
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 text-center card-hover animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <div className="bg-gradient-to-br from-nature-sunrise to-nature-sunset w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Sun size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-nature-forest mb-3">
              Performance Tracking
            </h3>
            <p className="text-gray-700">
              Fun, interactive games to test and improve your color perception over time
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-16 text-gray-600">
          <p className="text-sm">
            Designed with nature's palette • Powered by advanced vision science
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
