import React, { useState } from 'react';
import { Modal } from './Modal';
import axios from 'axios';
import Swal from 'sweetalert2';

export const UserModal = ({
  isOpen,
  onClose,
  mode,
  userData,
  token,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    password: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    if (formData.password) form.append('password', formData.password);
    if (imageFile) form.append('photo', imageFile);

    try {
      const baseUrl = 'http://localhost:5001/api/admin';
      if (mode === 'create') {
        await axios.post(`${baseUrl}/create-user`, form, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire('Success!', 'User created successfully', 'success');
      } else {
        await axios.put(`${baseUrl}/users/${userData._id}`, form, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire('Success!', 'User updated successfully', 'success');
      }
      onClose();
      onSuccess();
    } catch (err) {
      console.error('Operation failed', err);
      Swal.fire('Error', `Failed to ${mode} user`, 'error');
    }
  };

  const formatLabel = (label) =>
    label.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase());

  if (mode === 'view') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="User Details" maxWidth="max-w-2xl">
        <div className="space-y-6">
          {Object.entries(userData || {}).map(([key, value]) => {
            if (['_id', '__v', 'password'].includes(key)) return null;
            return (
              <div key={key} className="border-b border-gray-100 pb-4">
                <dt className="font-medium text-gray-700 mb-2">{formatLabel(key)}</dt>
                <dd className="text-gray-900">
                  {key.includes('imageUrl') || key.includes('photo') ? (
                    <img src={String(value)} alt={key} className="w-32 h-32 object-cover rounded-xl shadow-md" />
                  ) : typeof value === 'object' ? (
                    <pre className="text-sm bg-gray-50 p-3 rounded-lg overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>
                  ) : (
                    <span className="text-gray-900">{String(value)}</span>
                  )}
                </dd>
              </div>
            );
          })}
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${mode === 'create' ? 'Create' : 'Edit'} User`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password {mode === 'edit' && '(leave blank to keep current)'}
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required={mode === 'create'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {mode === 'create' ? 'Create User' : 'Update User'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};