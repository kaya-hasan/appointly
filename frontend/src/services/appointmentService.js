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

export default {
  getAppointments,
  createAppointment,
};
