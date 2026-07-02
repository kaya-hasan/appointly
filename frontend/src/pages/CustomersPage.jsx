import React, { useEffect, useState } from "react";
import customerService from "../services/customerService";


const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const customer = {
      name,
      email,
      phone
    }

    await customerService.createCustomer(customer);
    const updatedCustomers = await customerService.getCustomers();
    setCustomers(updatedCustomers);

    setName("");
    setEmail("");
    setPhone("");
  }

  useEffect(() => {
    customerService.getCustomers().then(setCustomers);
  }, []);

  return (
    <div>
      <h1>Customers</h1>
      <form action="" onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />

        <button type="submit">Add Customer</button>
      </form>
      {customers.length === 0 ? (
        <p>No customers yet.</p>
      ) : (
        <ul>
          {customers.map((customer) => (
            <li key={customer.id}>{customer.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomersPage;
