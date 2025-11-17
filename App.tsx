
import React, { useState, useEffect, useCallback } from 'react';
import { findBusinessesWithoutWebsite } from './services/geminiService';
import type { Business } from './types';
import SearchBar from './components/SearchBar';
import BusinessCard from './components/BusinessCard';
import Loader from './components/Loader';
import ErrorAlert from './components/ErrorAlert';
import LocationDisplay from './components/LocationDisplay';
import { BuildingIcon } from './components/icons/BuildingIcon';

const App: React.FC = () => {
  const [businessType, setBusinessType] = useState<string>('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        setError(null);
      },
      () => {
        setError('Unable to retrieve your location. Please enable location services.');
      }
    );
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a business type.');
      return;
    }
    if (!location) {
      setError('Could not get your location. Please allow location access and try again.');
      getLocation(); // try to get it again
      return;
    }

    setIsLoading(true);
    setError(null);
    setBusinesses([]);
    setHasSearched(true);
    setBusinessType(query);

    try {
      const results = await findBusinessesWithoutWebsite(query, location);
      setBusinesses(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center">
           <div className="flex items-center space-x-3 mb-4 md:mb-0">
             <div className="bg-indigo-600 p-2 rounded-lg">
                <BuildingIcon className="h-6 w-6 text-white" />
             </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Website-less Business Finder
            </h1>
          </div>
          <LocationDisplay location={location} onRefresh={getLocation} />
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-gray-600 mb-6">
            Enter a type of business (e.g., "coffee shops," "plumbers," "bookstores") to find local establishments without a website.
          </p>

          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          
          {error && <ErrorAlert message={error} />}

          <div className="mt-8">
            {isLoading && <Loader />}

            {!isLoading && hasSearched && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">
                  Results for "{businessType}"
                </h2>
                {businesses.length > 0 ? (
                  <div className="space-y-4">
                    {businesses.map((business, index) => (
                      <BusinessCard key={index} business={business} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 px-6 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No businesses without websites found for your search.</p>
                  </div>
                )}
              </>
            )}

            {!isLoading && !hasSearched && (
              <div className="text-center py-20 px-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <BuildingIcon className="h-16 w-16 mx-auto text-indigo-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-700">Ready to Discover?</h3>
                <p className="mt-1 text-sm text-gray-500">Your search results will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="text-center py-4 mt-8">
          <p className="text-sm text-gray-500">Powered by Google Gemini & Maps</p>
      </footer>
    </div>
  );
};

export default App;
