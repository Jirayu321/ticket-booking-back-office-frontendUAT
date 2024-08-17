// import axios from 'axios';
// import { ENV } from '../config/constants';

// const back_api_url = ENV.REACT_APP_BACK_END_API_URL;
// const API_URL = back_api_url|| "http://localhost:8175/"; // Your backend API URL

// export const getViewPlanList = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/view-plan-list`);
//     console.log('API Response:', response.data); // Log the response to check the structure
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching view plan list:', error);
//     throw error;
//   }
// };

// export const getTicketTypes = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/ticket-types`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching ticket types:', error);
//     throw error;
//   }
// };

// export const getViewEventList = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/view-event-list`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching view event list:', error);
//     throw error;
//   }
// };

// export const getTicketNumberPerPlan = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/ticket-number-per-plan`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching view event list:', error);
//     throw error;
//   }
// };


// // Function to save event data
// export const postEvent = async (eventData) => {
//   try {
//     const response = await axios.post(`${API_URL}/create_event`, eventData);
//     return response.data;
//   } catch (error) {
//     console.error("Error posting event:", error);
//     throw error;
//   }
// };

// // Function to save event stock data
// export const postEventStock = async (stockData) => {
//   try {
//     const response = await axios.post(`${API_URL}/create_stock`, stockData);
//     return response.data;
//   } catch (error) {
//     console.error("Error posting event stock:", error);
//     throw error;
//   }
// };

// // Function to save event log prices
// export const postLogEventPrice = async (priceData) => {
//   try {
//     const response = await axios.post(`${API_URL}/create_price`, priceData);
//     return response.data;
//   } catch (error) {
//     console.error("Error posting log event price:", error);
//     throw error;
//   }
// };

// // Function to save ticket numbers
// export const postTicketNumber = async (ticketData) => {
//   try {
//     const response = await axios.post(`${API_URL}/create_ticket_number`, ticketData);
//     return response.data;
//   } catch (error) {
//     console.error("Error posting ticket numbers:", error);
//     throw error;
//   }
// };