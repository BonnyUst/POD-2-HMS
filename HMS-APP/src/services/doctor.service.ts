import apiClient from "../config/appClient";


export const getDoctors = async (
  page = 1,
  limit = 10,
  search = '',
  specialization = ''
) => {
  const response = await apiClient.get('/doctors/list', {
    params: {
      page,
      limit,
      search: search.trim(),
      specialization:
      specialization === 'All' ? '' : specialization,
    },
  });

  return response.data;
};