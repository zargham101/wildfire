import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
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

  // Custom loading component with floating elements
  const CustomLoading = () => (
    <div className="flex items-center justify-center h-64">
      <div className="relative">
        {/* Main spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        
        {/* Floating dots */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        
        {/* Pulsing ring */}
        <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-b-2 border-blue-400 opacity-20"></div>
        
        {/* Rotating outer ring */}
        <div className="absolute -inset-2 animate-spin rounded-full border-2 border-transparent border-t-blue-300 opacity-30" style={{ animationDuration: '3s' }}></div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen pt-16 ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
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
          <header className={`sticky top-16 z-30 ${
            isDarkTheme ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'
          } backdrop-blur-sm shadow-sm border-b px-4 py-6 lg:px-8`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={`lg:hidden p-3 rounded-xl transition-colors ${
                    isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div>
                  <h1 className={`text-3xl font-bold capitalize ${
                    isDarkTheme ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedCategory.replace('-', ' ')}
                  </h1>
                  <p className={`text-sm mt-1 ${
                    isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Manage and monitor {selectedCategory.replace('-', ' ').toLowerCase()}
                  </p>
                </div>
              </div>
              <div className={`text-sm px-4 py-2 rounded-xl ${
                isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
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
              <CustomLoading />
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

                {/* Enhanced Pagination */}
                <div className="flex items-center justify-between mt-8">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className={`flex items-center gap-3 px-6 py-3 border-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium ${
                      isDarkTheme 
                        ? 'border-gray-600 hover:bg-gray-700 text-white hover:border-gray-500' 
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700 hover:border-gray-400'
                    } ${page === 1 ? '' : 'hover:shadow-md transform hover:scale-105'}`}
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-6 py-3 rounded-xl font-medium ${
                      isDarkTheme 
                        ? 'bg-blue-900 text-blue-200 border-2 border-blue-700' 
                        : 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                    }`}>
                      Page {page}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className={`flex items-center gap-3 px-6 py-3 border-2 rounded-xl transition-all duration-200 font-medium hover:shadow-md transform hover:scale-105 ${
                      isDarkTheme 
                        ? 'border-gray-600 hover:bg-gray-700 text-white hover:border-gray-500' 
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700 hover:border-gray-400'
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
          <div className="space-y-6">
            {Object.entries(viewModal.data).map(([key, value]) => {
              if (['_id', '__v', 'password'].includes(key)) return null;
              return (
                <div key={key} className="border-b border-gray-100 pb-4">
                  <dt className="font-medium text-gray-700 mb-2">{formatLabel(key)}</dt>
                  <dd className="text-gray-900">
                    {(key.includes('imageUrl') || key.includes('camImageUrl')) && value ? (
                      <img src={String(value)} alt={key} className="w-48 h-auto rounded-xl shadow-md" />
                    ) : typeof value === 'object' && value !== null ? (
                      <div className="space-y-1 text-sm bg-gray-50 p-4 rounded-xl">
                        {Object.entries(value).map(([k, v]) => (
                          <div key={k} className="flex gap-2">
                            <span className="font-medium text-gray-600">{formatLabel(k)}:</span> 
                            <span className="text-gray-900">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-900">{String(value)}</span>
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