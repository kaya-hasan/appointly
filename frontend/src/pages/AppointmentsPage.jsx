import React, { useEffect, useState } from "react";
import appointmentService from "../services/appointmentService";
import customerService from "../services/customerService";

const AppointmentsPage = () => {
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
        setError("Failed to fetch data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
        setError("Appointment already exists.");
      } else if (editId) {
        setError("Failed to update appointment.");
      } else {
        setError("Failed to add appointment.");
      }
    }
  };

  const getCustomerName = (customerId) => {
    return (
      customers.find((customer) => customer.id === customerId)?.name ||
      "Unknown Customer"
    );
  };

  const handleDeleteAppointment = async (id) => {
    setError(null);

    try {
      await appointmentService.deleteAppointment(id);
      const updatedAppointments = await appointmentService.getAppointments();
      setAppointments(updatedAppointments);
    } catch (error) {
      setError("Failed to delete appointment.");
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

  return (
    <div className="page">
      <h1>Appointments</h1>
      <p className="page-description">Track bookings, statuses and assigned customers.</p>
      {error && <p className="page-error">{error}</p>}

      <form className="entity-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Service Type"
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
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
        >
          <option value="">Select Customer</option>
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

        <button className="primary-button" type="submit">
          {editId ? "Update Appointment" : "Add Appointment"}
        </button>
        {editId && (
          <button className="secondary-button" type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p className="empty-state">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="empty-state">No appointments yet.</p>
      ) : (
        <ul className="entity-list">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="entity-item">
              <div>
                <strong>{appointment.service_type}</strong>
                <p>{appointment.appointment_date}</p>
                <p>{appointment.start_time} to {appointment.end_time}</p>
                <p>{appointment.status} - {getCustomerName(appointment.customer_id)}</p>
              </div>
              <div className="entity-actions">
                <button className="primary-button" type="button" onClick={() => handleStartEdit(appointment)}>
                  Edit
                </button>
                <button className="secondary-button" type="button" onClick={() => handleDeleteAppointment(appointment.id)}>
                  Delete
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
