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
    const id = userId || '';
    if (userNameMap[id]) return userNameMap[id];

    try {
      const res = await axios.get(`http://localhost:5001/api/user/user-details/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const name = res.data.name;
      setUserNameMap((prev) => ({ ...prev, [id]: name }));
      return name;
    } catch {
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
            axios.get('http://localhost:5001/api/user/user-role?role=agency', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          const enrichedData = await Promise.all(
            requestRes.data.map(async (item) => ({
              ...item,
              userName: await fetchUserName(item.userId),
            }))
          );
          console.log('Enriched Data:', enrichedData);

          const agencies = Array.isArray(agencyRes.data) ? agencyRes.data : agencyRes.data.data || [];
          setAgencyUsers(agencies.filter((agency) => !agency.locked));

          const completed = enrichedData.filter((req) => req.status === 'completed').length;
          const pending = enrichedData.filter((req) => req.status === 'pending').length;

          setCompletedRequestsCount(completed);
          setPendingRequestsCount(pending);
          setData(enrichedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          break;

        case 'image-predictions':
          res = await axios.get(`${baseUrl}/image-predictions?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setData(res.data);
          break;

        case 'feature-predictions':
          res = await axios.get(`${baseUrl}/feature-predictions?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setData(res.data);
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
