import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Your backend API URL

export const getViewPlanList = async () => {
  try {
    const response = await axios.get(`${API_URL}/view-plan-list`);
    console.log('API Response:', response.data); // Log the response to check the structure
    return response.data;
  } catch (error) {
    console.error('Error fetching view plan list:', error);
    throw error;
  }
};

export const getTicketTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/ticket-types`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket types:', error);
    throw error;
  }
};

export const getViewEventList = async () => {
  try {
    const response = await axios.get(`${API_URL}/view-event-list`);
    return response.data;
  } catch (error) {
    console.error('Error fetching view event list:', error);
    throw error;
  }
};
