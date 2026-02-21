import React, { useState, useEffect } from 'react';
import { AlertCircle, MapPin, Phone, Navigation } from 'lucide-react';
import { emergencyService } from '../services/api';

const Emergency = () => {
  const [location, setLocation] = useState(null);
  const [nearbyLocations, setNearbyLocations] = useState([]);
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);

  useEffect(() => {
    // Get user's current location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => console.error('Location error:', error)
      );
    }
  }, []);

  const handleSOS = async () => {
    if (!location) {
      alert('Unable to get your location. Please enable location services.');
      return;
    }

    setLoading(true);
    try {
      const response = await emergencyService.triggerEmergency(
        location.latitude,
        location.longitude,
        emergencyMessage || 'Emergency alert triggered manually'
      );

      setSosTriggered(true);

      // Play siren sound (using Web Audio API)
      playEmergencySiren();

      // Flash screen
      flashScreen();

      // Get nearby locations
      if (response.alert.nearbyPoliceStations) {
        setNearbyLocations(response.alert.nearbyPoliceStations);
      }

      alert('Emergency alert sent! Help is on the way. Nearby police stations have been notified.');
    } catch (error) {
      alert('Error triggering emergency: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const playEmergencySiren = () => {
    // Create a simple siren sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime + 2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 2);
  };

  const flashScreen = () => {
    let flashes = 0;
    const flash = () => {
      if (flashes < 10) {
        document.body.style.backgroundColor = flashes % 2 === 0 ? '#ff0000' : '#ffffff';
        flashes++;
        setTimeout(flash, 200);
      } else {
        document.body.style.backgroundColor = '';
      }
    };
    flash();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* SOS Button */}
        <div className="mb-8 text-center">
          <button
            onClick={handleSOS}
            disabled={loading || sosTriggered}
            className={`relative w-48 h-48 rounded-full font-bold text-white text-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 ${
              sosTriggered || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-br from-danger to-red-700 pulse-danger hover:shadow-danger'
            }`}
          >
            <div className="absolute inset-0 rounded-full border-4 border-white opacity-50"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <AlertCircle size={64} />
              <span className="mt-2">SOS</span>
            </div>
          </button>
          {sosTriggered && (
            <div className="mt-4 text-lg font-bold text-red-600">
              Emergency alert sent! Hold tight, help is on the way! 🚨
            </div>
          )}
        </div>

        {/* Emergency Message */}
        <div className="max-w-2xl mx-auto mb-8">
          <label className="block text-sm font-medium mb-2">Additional Message (optional)</label>
          <textarea
            value={emergencyMessage}
            onChange={(e) => setEmergencyMessage(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Describe your situation..."
            rows={4}
          />
        </div>

        {/* Emergency Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          <div className="card bg-red-50 dark:bg-red-900 border-l-4 border-danger">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Phone className="text-danger" size={24} />
              Emergency Numbers
            </h3>
            <div className="space-y-2 text-sm">
              <div><strong>Police:</strong> 100</div>
              <div><strong>Ambulance:</strong> 102</div>
              <div><strong>Fire Service:</strong> 101</div>
              <div><strong>Women Helpline:</strong> 1091</div>
              <div><strong>Disaster Management:</strong> 108</div>
            </div>
          </div>

          {/* Location Info */}
          <div className="card bg-blue-50 dark:bg-blue-900">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MapPin className="text-primary" size={24} />
              Your Location
            </h3>
            {location ? (
              <div className="space-y-2 text-sm">
                <div><strong>Latitude:</strong> {location.latitude.toFixed(4)}</div>
                <div><strong>Longitude:</strong> {location.longitude.toFixed(4)}</div>
                <div className="mt-4">
                  <a
                    href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-accent font-medium"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-sm">Fetching your location...</p>
            )}
          </div>
        </div>

        {/* Nearby Safe Locations */}
        {nearbyLocations.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Nearest Police Stations</h2>
            <div className="space-y-4">
              {nearbyLocations.map((location, index) => (
                <div key={index} className="card">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{location.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{location.distance.toFixed(1)} km away</p>
                      {location.phone && (
                        <p className="text-primary font-medium mt-2">📞 {location.phone}</p>
                      )}
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${location.location.latitude},${location.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      <Navigation size={20} />
                      Navigate
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety Tips */}
        <div className="max-w-4xl mx-auto mt-12 card bg-yellow-50 dark:bg-yellow-900 border-l-4 border-warning">
          <h2 className="text-xl font-bold mb-4">When in Distress:</h2>
          <ul className="space-y-2 text-sm">
            <li>✓ Stay calm and try to find a safe location</li>
            <li>✓ Call emergency numbers immediately</li>
            <li>✓ Share your location with trusted contacts</li>
            <li>✓ Keep your phone charged and accessible</li>
            <li>✓ Use the SOS button only in real emergencies</li>
            <li>✓ Trust your instincts - if something feels wrong, it probably is</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
