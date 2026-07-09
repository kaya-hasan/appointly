import request from "./api";

async function getAppointments(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.offset !== undefined) {
    searchParams.set("offset", String(params.offset));
  }

  const query = searchParams.toString();
  const endpoint = query ? `appointments/?${query}` : "appointments/";
  return request(endpoint);
}

async function createAppointment(data) {
  return request("appointments/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function deleteAppointment(id) {
  return request(`appointments/${id}`, {
    method: "DELETE",
  });
}
async function updateAppointment(id, data) {
  return request(`appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export default {
  getAppointments,
  createAppointment,
  deleteAppointment,
  updateAppointment,
};
