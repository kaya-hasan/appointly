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

export default {
  getAppointments,
  createAppointment,
  deleteAppointment,
};
