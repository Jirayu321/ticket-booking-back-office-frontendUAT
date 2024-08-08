import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Your backend API URL

export interface Event {
  id: number;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  publishDate: string;
  status: string;
  publishStatus: string;
}

// Fetch all events
export const fetchEvents = async (): Promise<Event[]> => {
  const response = await axios.get<Event[]>(`${API_URL}/events`);
  return response.data;
};

// Create a new event
export const createEvent = async (event: Event): Promise<Event> => {
  const response = await axios.post<Event>(`${API_URL}/events`, event);
  return response.data;
};
