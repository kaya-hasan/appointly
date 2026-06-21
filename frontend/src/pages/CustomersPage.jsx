import React, { useEffect, useState } from "react";
import customerService from "../services/customerService";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    customerService.getCustomers().then(setCustomers);
  }, []);

  return (
    <div>
      <h1>Customers</h1>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>{customer.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CustomersPage;
