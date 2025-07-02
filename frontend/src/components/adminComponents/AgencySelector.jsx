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
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAgency?._id === agency._id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{agency.name}</div>
              <div className="text-sm text-gray-600">{agency.email}</div>
            </div>
          ))}
        </div>

        {agencyResources && (
          <div className="border-t pt-4">
            <h3 className="font-medium text-lg mb-3">Available Resources</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Firefighters:</span> {agencyResources.currentResources.firefighters}</div>
              <div><span className="font-medium">Firetrucks:</span> {agencyResources.currentResources.firetrucks}</div>
              <div><span className="font-medium">Helicopters:</span> {agencyResources.currentResources.helicopters}</div>
              <div><span className="font-medium">Commanders:</span> {agencyResources.currentResources.commanders}</div>
              <div className="col-span-2">
                <span className="font-medium">Heavy Equipment:</span> {agencyResources.heavyEquipment?.join(', ') || 'None'}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={!selectedAgency || isSubmitting}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Sending...' : 'Send Request'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
