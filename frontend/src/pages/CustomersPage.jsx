import React, { useEffect, useState } from "react";
import customerService from "../services/customerService";

const CustomersPage = ({ language }) => {
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

  const content = language === "tr"
    ? {
      title: "Müşteriler",
      description: "Müşteri kayıtlarını oluşturun, güncelleyin ve yönetin.",
      fetchError: "Müşteriler alınamadı.",
      existsError: "Müşteri zaten mevcut.",
      updateError: "Müşteri güncellenemedi.",
      addError: "Müşteri eklenemedi.",
      deleteBlocked: "Bu müşteriye bağlı randevular var, silinemez.",
      deleteError: "Müşteri silinemedi.",
      name: "Ad Soyad",
      email: "E-posta",
      phone: "Telefon",
      submitting: "Kaydediliyor...",
      update: "Müşteriyi Güncelle",
      add: "Müşteri Ekle",
      cancel: "İptal",
      searchPlaceholder: "Ad veya telefon ile ara",
      loading: "Müşteriler yükleniyor...",
      empty: "Henüz müşteri yok.",
      noMatch: "Eşleşen müşteri bulunamadı.",
      noEmail: "E-posta yok",
      deleting: "Siliniyor...",
      delete: "Sil",
      edit: "Düzenle",
    }
    : {
      title: "Customers",
      description: "Create, update and manage customer records.",
      fetchError: "Failed to fetch customers.",
      existsError: "Customer already exists.",
      updateError: "Failed to update customer.",
      addError: "Failed to add customer.",
      deleteBlocked: "This customer has appointments and cannot be deleted.",
      deleteError: "Failed to delete customer.",
      name: "Name",
      email: "Email",
      phone: "Phone",
      submitting: "Submitting...",
      update: "Update Customer",
      add: "Add Customer",
      cancel: "Cancel",
      searchPlaceholder: "Search by name or phone number",
      loading: "Loading customers...",
      empty: "No customers yet.",
      noMatch: "No matching customers found.",
      noEmail: "No email",
      deleting: "Deleting...",
      delete: "Delete",
      edit: "Edit",
    };

  useEffect(() => {
    setLoading(true);
    customerService.getCustomers()
      .then((data) => {
        setCustomers(data);
      }).catch(() => {
        setError(content.fetchError);
      }).finally(() => {
        setLoading(false);
      });
  }, [content.fetchError]);

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
        setError(content.existsError);
      } else if (editId) {
        setError(content.updateError);
      } else {
        setError(content.addError);
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
        setError(content.deleteBlocked);
      } else {
        setError(content.deleteError);
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
      <h1>{content.title}</h1>
      <p className="page-description">{content.description}</p>
      {error && <p className="page-error">{error}</p>}

      <form className="entity-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={content.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder={content.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder={content.phone}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <button className="primary-button" type="submit" disabled={submitting}>
          {submitting ? content.submitting : editId ? content.update : content.add}
        </button>
        {editId && (
          <button className="secondary-button" type="button" onClick={handleCancelEdit} disabled={submitting}>
            {content.cancel}
          </button>
        )}

      </form>
      <div className="search-bar">
        <input type="text" placeholder={content.searchPlaceholder} value={searchName} onChange={(e) => setSearchName(e.target.value)} />
      </div>

      {loading ? (
        <p className="empty-state">{content.loading}</p>
      ) : customers.length === 0 ? (
        <p className="empty-state">{content.empty}</p>
      ) : filteredCustomers.length === 0 ? (
        <p className="empty-state">{content.noMatch}</p>
      ) : (
        <ul className="entity-list">
          {filteredCustomers.map((customer) => (
            <li key={customer.id} className="entity-item">
              <div>
                <strong>{customer.name}</strong>
                <p>{customer.email || content.noEmail}</p>
                <p>{customer.phone}</p>
              </div>
              <div className="entity-actions">
                <button className="secondary-button" type="button" onClick={() => handleDeleteCustomer(customer.id)} disabled={deletingId === customer.id}>
                  {deletingId === customer.id ? content.deleting : content.delete}
                </button>
                <button className="primary-button" type="button" onClick={() => handleStartEdit(customer)} disabled={submitting}>
                  {content.edit}
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
