
import React from 'react';
import type { Business } from '../types';
import { GlobeIcon } from './icons/GlobeIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { LinkIcon } from './icons/LinkIcon';


interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow border border-gray-200 transition-all hover:shadow-md hover:border-indigo-300">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start">
        <div>
          <h3 className="text-lg font-bold text-indigo-700">{business.name}</h3>
          <p className="text-gray-600 mt-1">{business.address}</p>
        </div>
        {business.mapsUrl && (
            <a
            href={business.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 sm:mt-0 flex items-center justify-center text-sm bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
            >
            <LinkIcon className="h-4 w-4 mr-2" />
            View on Map
            </a>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm">
        <div className="flex items-center text-red-500">
            <GlobeIcon className="h-5 w-5 mr-2" />
            <span className="font-semibold">No Website Listed</span>
        </div>
        {business.phone && (
          <div className="flex items-center text-gray-500">
            <PhoneIcon className="h-5 w-5 mr-2" />
            <span>{business.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessCard;
