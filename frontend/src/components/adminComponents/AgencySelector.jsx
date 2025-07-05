import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import axios from 'axios';
import Swal from 'sweetalert2';

export const AgencySelector = ({
  isOpen,
  onClose,
  requestId,
  agencyUsers,
  token,
  onSuccess,
}) => {
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [agencyResources, setAgencyResources] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      if (!selectedAgency) return;
      try {
        const res = await axios.get(
          `http://localhost:5001/api/agency/agencies/${selectedAgency._id}/resources`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAgencyResources(res.data);
      } catch (err) {
        console.error('Failed to fetch agency resources', err);
        setAgencyResources(null);
      }
    };
    fetchResources();
  }, [selectedAgency, token]);

  const handleSubmit = async () => {
    if (!selectedAgency) return;
    setIsSubmitting(true);
    try {
      await axios.post(
        `http://localhost:5001/api/agency/resource-requests/${requestId}/assign`,
        { agencyId: selectedAgency._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire('Success!', 'Request sent to agency successfully', 'success');
      onClose();
      onSuccess();
    } catch (err) {
      console.error('Failed to send request', err);
      Swal.fire('Error', 'Failed to send request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Agency" maxWidth="max-w-2xl">
      <div className="space-y-6">
        <div className="grid gap-3 max-h-64 overflow-y-auto">
          {agencyUsers.map((agency) => (
            <div
              key={agency._id}
              onClick={() => setSelectedAgency(agency)}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedAgency?._id === agency._id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">{agency.name}</div>
              <div className="text-sm text-gray-600">{agency.email}</div>
            </div>
          ))}
        </div>

        {agencyResources && (
          <div className="border-t pt-6">
            <h3 className="font-medium text-lg mb-4 text-gray-900">Available Resources</h3>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Firefighters:</span> 
                  <span className="text-blue-600 font-bold">{agencyResources.currentResources.firefighters}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Firetrucks:</span> 
                  <span className="text-green-600 font-bold">{agencyResources.currentResources.firetrucks}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">Helicopters:</span> 
                  <span className="text-purple-600 font-bold">{agencyResources.currentResources.helicopters}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="font-medium">Commanders:</span> 
                  <span className="text-orange-600 font-bold">{agencyResources.currentResources.commanders}</span>
                </div>
              </div>
              {agencyResources.heavyEquipment && agencyResources.heavyEquipment.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium">Heavy Equipment:</span> 
                    <span className="text-red-600 font-bold">{agencyResources.heavyEquipment.join(', ')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={!selectedAgency || isSubmitting}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isSubmitting ? 'Sending...' : 'Send Request'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};