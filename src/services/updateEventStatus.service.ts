import { authAxiosClient } from "../config/axios.config";

export async function updateEventStatusbyeventId( event_id: any) {
  try {
    const response = await authAxiosClient.post(
      `/update-event-status-by-eventid/${event_id}`
    );

    if (response.status !== 200) throw new Error(`Unexpected response status: ${response.status}`);

    return response.data; // Return the server's response
  } catch (error:any) {
    console.error("Error updating Event Status by eventId:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || "An unexpected error occurred." };
  }
}
