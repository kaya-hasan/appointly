import request from "./api";

async function getAppointments() {
  return request("appointments/");
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
