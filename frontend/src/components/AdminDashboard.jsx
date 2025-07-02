import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

import { useAdminData } from './adminComponents/hooks/useAdminData';
import { AdminSidebar } from './adminComponents/AdminSidebarNew';
import { StatsCards } from './adminComponents/StatsCards';
import { DataTable } from './adminComponents/DataTable';
import { UserModal } from './adminComponents/UserModal';
import { AgencySelector } from './adminComponents/AgencySelector';
import { Modal } from './adminComponents/Modal';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('users');
  const [page, setPage] = useState(1);
  const [token] = useState(localStorage.getItem('admin_token'));
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [newRequestsCount, setNewRequestsCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal states
  const [userModal, setUserModal] = useState({ isOpen: false, mode: 'create', data: null });
  const [agencyModal, setAgencyModal] = useState({ isOpen: false, requestId: '' });
  const [viewModal, setViewModal] = useState({ isOpen: false, data: null });

  const { data, loading, agencyUsers, completedRequestsCount, pendingRequestsCount, refetch } = useAdminData({
    category: selectedCategory,
    page,
    limit: 10,
    token: token || '',
  });

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  // Poll for new requests
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/agency/resource-requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const unseenCount = res.data.filter((req) => !req.isSeen).length;
        setNewRequestsCount(unseenCount);
      } catch (err) {
        console.error('Failed to poll resource requests', err);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const handleResourceRequestsClick = () => {
    setSelectedCategory('resource-requests');
    setNewRequestsCount(0);
    setIsSidebarOpen(false);
  };

  const handleView = async (item) => {
    try {
      const baseUrl = 'http://localhost:5001/api/admin';
      const endpoints = {
        users: `${baseUrl}/users/${item._id}`,
        'image-predictions': `${baseUrl}/image-predictions/${item._id}`,
        'feature-predictions': `${baseUrl}/feature-predictions/${item._id}`,
      };
      
      const endpoint = endpoints[selectedCategory];
      if (endpoint) {
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setViewModal({ isOpen: true, data: res.data });
      }
    } catch (err) {
      console.error('Error fetching item details:', err);
      Swal.fire('Error', 'Failed to fetch details', 'error');
    }
  };

  const handleEdit = async (item) => {
    if (selectedCategory === 'users') {
      try {
        const res = await axios.get(`http://localhost:5001/api/admin/users/${item._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserModal({ isOpen: true, mode: 'edit', data: res.data });
      } catch (err) {
        Swal.fire('Error', 'Failed to fetch user details', 'error');
      }
    }
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to undo this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const baseUrl = 'http://localhost:5001/api/admin';
        const endpoints = {
          users: `${baseUrl}/users/${item._id}`,
          'image-predictions': `${baseUrl}/image-predictions/${item._id}`,
          'feature-predictions': `${baseUrl}/feature-predictions/${item._id}`,
        };
        
        const endpoint = endpoints[selectedCategory];
        if (endpoint) {
          await axios.delete(endpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });
          refetch();
          Swal.fire('Deleted!', 'Record has been deleted.', 'success');
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete', 'error');
      }
    }
  };

  const handleCreate = () => {
    const actions = {
      users: () => setUserModal({ isOpen: true, mode: 'create', data: null }),
      'image-predictions': () => navigate('/predict/cam/result'),
      'feature-predictions': () => navigate('/predictionHomePage'),
    };
    
    const action = actions[selectedCategory];
    if (action) action();
    else navigate(`/admin/create/${selectedCategory}`);
    
    // Close sidebar on mobile after action
    setIsSidebarOpen(false);
  };

  const formatLabel = (label) =>
    label.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase());

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
          <AdminSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            newRequestsCount={newRequestsCount}
            isDarkTheme={isDarkTheme}
            setIsDarkTheme={setIsDarkTheme}
            onResourceRequestsClick={handleResourceRequestsClick}
            onCreateClick={handleCreate}
          />
        </div>

        {/* Main content */}
        <main className="flex-1 lg:ml-0 min-h-screen">
          {/* Header */}
          <header className={`${isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b px-4 py-4 lg:px-8`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={`lg:hidden p-2 rounded-lg transition-colors ${
                    isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Menu size={24} />
                </button>
                <h1 className={`text-2xl font-bold capitalize ${
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                }`}>
                  {selectedCategory.replace('-', ' ')}
                </h1>
              </div>
              <div className="text-sm text-gray-500">
                Page {page}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-4 lg:p-8">
            {selectedCategory === 'resource-requests' && (
              <StatsCards
                completedCount={completedRequestsCount}
                pendingCount={pendingRequestsCount}
                totalCount={data.length}
              />
            )}

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <DataTable
                  data={data}
                  category={selectedCategory}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onSendRequest={selectedCategory === 'resource-requests' ? (id) => setAgencyModal({ isOpen: true, requestId: id }) : undefined}
                  isDarkTheme={isDarkTheme}
                />

                {/* Pagination */}
                <div className="flex items-center justify-between mt-8">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDarkTheme 
                        ? 'border-gray-600 hover:bg-gray-700 text-white' 
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                  
                  <span className={`px-4 py-2 rounded-lg font-medium ${
                    isDarkTheme 
                      ? 'bg-blue-900 text-blue-200' 
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    Page {page}
                  </span>
                  
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                      isDarkTheme 
                        ? 'border-gray-600 hover:bg-gray-700 text-white' 
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <UserModal
        isOpen={userModal.isOpen}
        onClose={() => setUserModal({ isOpen: false, mode: 'create', data: null })}
        mode={userModal.mode}
        userData={userModal.data}
        token={token || ''}
        onSuccess={refetch}
      />

      <AgencySelector
        isOpen={agencyModal.isOpen}
        onClose={() => setAgencyModal({ isOpen: false, requestId: '' })}
        requestId={agencyModal.requestId}
        agencyUsers={agencyUsers}
        token={token || ''}
        onSuccess={refetch}
      />

      <Modal
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, data: null })}
        title={`${formatLabel(selectedCategory)} Details`}
        maxWidth="max-w-4xl"
      >
        {viewModal.data && (
          <div className="space-y-4">
            {Object.entries(viewModal.data).map(([key, value]) => {
              if (['_id', '__v', 'password'].includes(key)) return null;
              return (
                <div key={key} className="border-b pb-3">
                  <dt className="font-medium text-gray-700">{formatLabel(key)}</dt>
                  <dd className="mt-1 text-gray-900">
                    {(key.includes('imageUrl') || key.includes('camImageUrl')) && value ? (
                      <img src={String(value)} alt={key} className="w-48 h-auto rounded-lg" />
                    ) : typeof value === 'object' && value !== null ? (
                      <div className="space-y-1 text-sm bg-gray-50 p-3 rounded">
                        {Object.entries(value).map(([k, v]) => (
                          <div key={k}>
                            <span className="font-medium">{formatLabel(k)}:</span> {String(v)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      String(value)
                    )}
                  </dd>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}