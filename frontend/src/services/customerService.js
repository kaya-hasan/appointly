import request from "./api";

async function getCustomers() {
  return request("customers/");
}

async function createCustomer(data) {
  return request("customers/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function deleteCustomer(id) {
  return request(`customers/${id}`, {
    method: "DELETE",
  });
}
async function updateCustomer(id, data) {
  return request(`customers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export default {
  getCustomers,
  createCustomer,
  deleteCustomer,
  updateCustomer,
};
