
import React from 'react';
import { MapPinIcon } from './icons/MapPinIcon';

interface LocationDisplayProps {
    location: GeolocationCoordinates | null;
    onRefresh: () => void;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ location, onRefresh }) => {
    return (
        <div className="flex items-center space-x-2 text-sm text-gray-500 p-2 bg-gray-100 rounded-full">
            <MapPinIcon className="h-5 w-5 text-indigo-500" />
            {location ? (
                <span>
                    Lat: {location.latitude.toFixed(2)}, Lon: {location.longitude.toFixed(2)}
                </span>
            ) : (
                <span>Getting location...</span>
            )}
            <button onClick={onRefresh} title="Refresh location" className="text-gray-400 hover:text-indigo-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 20l-1.5-1.5A9 9 0 003.5 9" />
                </svg>
            </button>
        </div>
    );
};

export default LocationDisplay;
