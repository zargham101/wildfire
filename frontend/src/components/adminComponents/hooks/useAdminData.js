import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAdminData = ({ category, page, limit, token }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userNameMap, setUserNameMap] = useState({});
  const [agencyUsers, setAgencyUsers] = useState([]);
  const [completedRequestsCount, setCompletedRequestsCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  const fetchUserName = async (userId) => {
    // Handle different userId formats
    const id = userId?._id || userId || '';
    if (!id) return 'Unknown';
    if (userNameMap[id]) return userNameMap[id];

    try {
      console.log("Fetching user name for ID:", id);
      const res = await axios.get(`http://localhost:5001/api/user/user-details/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User details response:", res.data);
      const name = res.data.name || 'Unknown';
      setUserNameMap((prev) => ({ ...prev, [id]: name }));
      return name;
    } catch (error) {
      console.error("Error fetching user name:", error);
      return 'Unknown';
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const baseUrl = 'http://localhost:5001/api/admin';
      let res;

      switch (category) {
        case 'users':
          res = await axios.get(`${baseUrl}/users?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setData(res.data);
          break;

        case 'resource-requests':
          const [requestRes, agencyRes] = await Promise.all([
            axios.get('http://localhost:5001/api/agency/resource-requests', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get('http://localhost:5001/api/user/user-role?role=agency'),
          ]);

          const enrichedRequestData = await Promise.all(
            requestRes.data.map(async (item) => ({
              ...item,
              userName: await fetchUserName(item.userId),
            }))
          );
          console.log('Enriched Request Data:', enrichedRequestData);

          const agencies = Array.isArray(agencyRes.data) ? agencyRes.data : agencyRes.data.data || [];
          setAgencyUsers(agencies.filter((agency) => !agency.locked));

          const completed = enrichedRequestData.filter((req) => req.status === 'completed').length;
          const pending = enrichedRequestData.filter((req) => req.status === 'pending').length;

          setCompletedRequestsCount(completed);
          setPendingRequestsCount(pending);
          setData(enrichedRequestData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          break;

        case 'image-predictions':
          res = await axios.get(`${baseUrl}/image-predictions?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Enrich image predictions with user names
          const enrichedImageData = await Promise.all(
            res.data.map(async (item) => ({
              ...item,
              userName: await fetchUserName(item.userId),
            }))
          );
          console.log('Enriched Image Predictions:', enrichedImageData);
          setData(enrichedImageData);
          break;

        case 'feature-predictions':
          res = await axios.get(`${baseUrl}/feature-predictions?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Enrich feature predictions with user names
          const enrichedFeatureData = await Promise.all(
            res.data.map(async (item) => ({
              ...item,
              userName: await fetchUserName(item.userId),
            }))
          );
          console.log('Enriched Feature Predictions:', enrichedFeatureData);
          setData(enrichedFeatureData);
          break;
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [category, page, token]);

  return {
    data,
    loading,
    agencyUsers,
    completedRequestsCount,
    pendingRequestsCount,
    refetch: fetchData,
  };
};