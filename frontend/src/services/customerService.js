import request from "./api";

async function getCustomers(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.offset !== undefined) {
    searchParams.set("offset", String(params.offset));
  }

  const query = searchParams.toString();
  const endpoint = query ? `customers/?${query}` : "customers/";
  return request(endpoint);
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
