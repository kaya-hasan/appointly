import request from "./api";

async function getCustomers() {
  return request("customers");
}

async function createCustomer(data) {
  return request("customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export default {
  getCustomers,
  createCustomer,
};
