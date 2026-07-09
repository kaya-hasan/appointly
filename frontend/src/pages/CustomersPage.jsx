import React, { useEffect, useState } from "react";
import customerService from "../services/customerService";

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    setLoading(true);
    customerService.getCustomers()
      .then((data) => {
        setCustomers(data);
      }).catch(() => {
        setError("Failed to fetch customers");
      }).finally(() => {
        setLoading(false);
      });
  }, []);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customer = { name, email, phone };

    setError(null);

    try {
      setSubmitting(true);
      if (editId) {
        await customerService.updateCustomer(editId, customer);
      } else {
        await customerService.createCustomer(customer);
      }

      const updatedCustomers = await customerService.getCustomers();
      setCustomers(updatedCustomers);
      resetForm();
    } catch (error) {
      if (!editId && error.message.includes("409")) {
        setError("Customer already exists.");
      } else if (editId) {
        setError("Failed to update customer.");
      } else {
        setError("Failed to add customer.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (id) => {
    setError(null);
    try {
      setDeletingId(id);
      await customerService.deleteCustomer(id);
      const updatedCustomers = await customerService.getCustomers();
      setCustomers(updatedCustomers);
    } catch (error) {
      if (error.message.includes("409")) {
        setError("This customer has appointments and cannot be deleted.");
      } else {
        setError("Failed to delete customer.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartEdit = (customer) => {
    setEditId(customer.id);
    setName(customer.name);
    setEmail(customer.email || "");
    setPhone(customer.phone);
  };

  const handleCancelEdit = () => {
    resetForm();
    setError(null);
  };

  const filteredCustomers = customers.filter((customer) => {
    const query = searchName.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.phone?.toLowerCase().includes(query)
    );
  });




  return (
    <div className="page">
      <h1>Customers</h1>
      <p className="page-description">Create, update and manage customer records.</p>
      {error && <p className="page-error">{error}</p>}

      <form className="entity-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : editId ? "Update Customer" : "Add Customer"}
        </button>
        {editId && (
          <button className="secondary-button" type="button" onClick={handleCancelEdit} disabled={submitting}>
            Cancel
          </button>
        )}

      </form>
      <div className="search-bar">
        <input type="text" placeholder="Search by name or phone number" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
      </div>

      {loading ? (
        <p className="empty-state">Loading customers...</p>
      ) : customers.length === 0 ? (
        <p className="empty-state">No customers yet.</p>
      ) : filteredCustomers.length === 0 ? (
        <p className="empty-state">No matching customers found.</p>
      ) : (
        <ul className="entity-list">
          {filteredCustomers.map((customer) => (
            <li key={customer.id} className="entity-item">
              <div>
                <strong>{customer.name}</strong>
                <p>{customer.email || "No email"}</p>
                <p>{customer.phone}</p>
              </div>
              <div className="entity-actions">
                <button className="secondary-button" type="button" onClick={() => handleDeleteCustomer(customer.id)} disabled={deletingId === customer.id}>
                  {deletingId === customer.id ? "Deleting..." : "Delete"}
                </button>
                <button className="primary-button" type="button" onClick={() => handleStartEdit(customer)} disabled={submitting}>
                  {"Edit"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomersPage;
