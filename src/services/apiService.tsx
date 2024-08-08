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


export interface TicketType {
  ticket_type_id: number;
  ticket_type_name: string;
  ticket_type_unit: string;
  ticket_type_cal: string;
}

export interface Plan {
  plan_id: number;
  plangroup_id: number;
  plan_name: string;
  plan_desc: string;
  plan_pic: string;
  plan_active: string;
}

export interface PlanGroup {
  plangroup_id: number;
  plangroup_name: string;
  plangroup_active: string;
}

export const fetchTicketTypes = async (): Promise<TicketType[]> => {
  const response = await axios.get<TicketType[]>(`${API_URL}/get_ticket_type`);
  return response.data;
};

export const fetchPlans = async (): Promise<Plan[]> => {
  const response = await axios.get<Plan[]>(`${API_URL}/get_plan`);
  return response.data;
};

export const fetchPlanGroups = async (): Promise<PlanGroup[]> => {
  const response = await axios.get<PlanGroup[]>(`${API_URL}/get_plan_group`);
  return response.data;
};