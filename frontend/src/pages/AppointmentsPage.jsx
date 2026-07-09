import React, { useEffect, useState } from "react";
import appointmentService from "../services/appointmentService";
import customerService from "../services/customerService";

const AppointmentsPage = ({ language }) => {
  const [appointments, setAppointments] = useState([]);
  const [serviceType, setServiceType] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [status, setStatus] = useState("pending");
  const [customerId, setCustomerId] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const content = language === "tr"
    ? {
      title: "Randevular",
      description: "Randevuları, durumlarını ve atanan müşterileri takip edin.",
      fetchError: "Veriler alınamadı.",
      existsError: "Randevu zaten mevcut.",
      updateError: "Randevu güncellenemedi.",
      addError: "Randevu eklenemedi.",
      deleteError: "Randevu silinemedi.",
      serviceType: "Hizmet Türü",
      selectCustomer: "Müşteri Seç",
      submitting: "Kaydediliyor...",
      update: "Randevuyu Güncelle",
      add: "Randevu Ekle",
      cancel: "İptal",
      searchService: "Hizmet türüne göre ara",
      searchCustomer: "Müşteri adına göre ara",
      allStatuses: "Tüm durumlar",
      pending: "Bekliyor",
      confirmed: "Onaylandı",
      cancelled: "İptal Edildi",
      loading: "Randevular yükleniyor...",
      empty: "Henüz randevu yok.",
      noMatch: "Eşleşen randevu bulunamadı.",
      unknownCustomer: "Bilinmeyen Müşteri",
      edit: "Düzenle",
      delete: "Sil",
      deleting: "Siliniyor...",
      timeConnector: "-",
    }
    : {
      title: "Appointments",
      description: "Track bookings, statuses and assigned customers.",
      fetchError: "Failed to fetch data.",
      existsError: "Appointment already exists.",
      updateError: "Failed to update appointment.",
      addError: "Failed to add appointment.",
      deleteError: "Failed to delete appointment.",
      serviceType: "Service Type",
      selectCustomer: "Select Customer",
      submitting: "Submitting...",
      update: "Update Appointment",
      add: "Add Appointment",
      cancel: "Cancel",
      searchService: "Search by service type",
      searchCustomer: "Search by customer name",
      allStatuses: "All statuses",
      pending: "Pending",
      confirmed: "Confirmed",
      cancelled: "Cancelled",
      loading: "Loading appointments...",
      empty: "No appointments yet.",
      noMatch: "No matching appointments found.",
      unknownCustomer: "Unknown Customer",
      edit: "Edit",
      delete: "Delete",
      deleting: "Deleting...",
      timeConnector: "to",
    };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      appointmentService.getAppointments(),
      customerService.getCustomers(),
    ])
      .then(([appointmentsData, customersData]) => {
        setAppointments(appointmentsData);
        setCustomers(customersData);
      })
      .catch(() => {
        setError(content.fetchError);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [content.fetchError]);

  const resetForm = () => {
    setServiceType("");
    setAppointmentDate("");
    setStartTime("");
    setStatus("pending");
    setCustomerId("");
    setEndTime("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const appointment = {
      service_type: serviceType,
      appointment_date: appointmentDate,
      start_time: startTime,
      status,
      customer_id: customerId,
      end_time: endTime,
    };

    setError(null);

    try {
      setSubmitting(true);
      if (editId) {
        await appointmentService.updateAppointment(editId, appointment);
      } else {
        await appointmentService.createAppointment(appointment);
      }

      const updatedAppointments = await appointmentService.getAppointments();
      setAppointments(updatedAppointments);
      resetForm();
    } catch (error) {
      if (error.message.includes("409")) {
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

  const getCustomerName = (customerId) => {
    return (
      customers.find((customer) => customer.id === customerId)?.name ||
      content.unknownCustomer
    );
  };

  const handleDeleteAppointment = async (id) => {
    setError(null);
    try {
      setDeletingId(id);
      await appointmentService.deleteAppointment(id);
      const updatedAppointments = await appointmentService.getAppointments();
      setAppointments(updatedAppointments);
    } catch (error) {
      setError(content.deleteError);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartEdit = (appointment) => {
    setEditId(appointment.id);
    setServiceType(appointment.service_type);
    setAppointmentDate(appointment.appointment_date);
    setStartTime(appointment.start_time);
    setStatus(appointment.status);
    setCustomerId(String(appointment.customer_id));
    setEndTime(appointment.end_time);
  };

  const handleCancelEdit = () => {
    resetForm();
    setError(null);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const serviceQuery = serviceTypeFilter.toLowerCase();
    const customerQuery = searchName.toLowerCase();
    const customerName = getCustomerName(appointment.customer_id).toLowerCase();

    const matchesService = appointment.service_type
      .toLowerCase()
      .includes(serviceQuery);

    const matchesCustomer = customerName.includes(customerQuery);

    const matchesStatus =
      statusFilter === "" || appointment.status === statusFilter;

    return matchesService && matchesCustomer && matchesStatus;
  });

  return (
    <div className="page">
      <h1>{content.title}</h1>
      <p className="page-description">{content.description}</p>
      {error && <p className="page-error">{error}</p>}

      <form className="entity-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={content.serviceType}
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          required
        />
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">{content.pending}</option>
          <option value="confirmed">{content.confirmed}</option>
          <option value="cancelled">{content.cancelled}</option>
        </select>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
        >
          <option value="">{content.selectCustomer}</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
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
        <input
          type="text"
          placeholder={content.searchService}
          value={serviceTypeFilter}
          onChange={(e) => setServiceTypeFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder={content.searchCustomer}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">{content.allStatuses}</option>
          <option value="pending">{content.pending}</option>
          <option value="confirmed">{content.confirmed}</option>
          <option value="cancelled">{content.cancelled}</option>
        </select>
      </div>

      {loading ? (
        <p className="empty-state">{content.loading}</p>
      ) : appointments.length === 0 ? (
        <p className="empty-state">{content.empty}</p>
      ) : filteredAppointments.length === 0 ? (
        <p className="empty-state">{content.noMatch}</p>
      ) : (
        <ul className="entity-list">
          {filteredAppointments.map((appointment) => (
            <li key={appointment.id} className="entity-item">
              <div>
                <strong>{appointment.service_type}</strong>
                <p>{appointment.appointment_date}</p>
                <p>{appointment.start_time} {content.timeConnector} {appointment.end_time}</p>
                <p>{appointment.status} - {getCustomerName(appointment.customer_id)}</p>
              </div>
              <div className="entity-actions">
                <button className="primary-button" type="button" onClick={() => handleStartEdit(appointment)} disabled={submitting}>
                  {content.edit}
                </button>
                <button className="secondary-button" type="button" onClick={() => handleDeleteAppointment(appointment.id)} disabled={deletingId === appointment.id}>
                  {deletingId === appointment.id ? content.deleting : content.delete}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentsPage;
