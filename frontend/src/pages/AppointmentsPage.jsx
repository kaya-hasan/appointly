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
      await appointmentService.createAppointment(appointment);
      const updatedAppointments = await appointmentService.getAppointments();
      setAppointments(updatedAppointments);

      setServiceType("");
      setAppointmentDate("");
      setStartTime("");
      setStatus("pending");
      setCustomerId("");
      setEndTime("");
    } catch (error) {
      if (error.message.includes("409")) {
        setError("Appointment already exists.");
      } else {
        setError("Failed to add appointment.");
      }
    }
  }
  const getCustomerName = (customerId) => {
    return customers.find((customer) => customer.id === customerId)?.name || "Unknown Customer";
  }
  useEffect(() => {
    appointmentService.getAppointments().then(setAppointments);
    customerService.getCustomers().then(setCustomers);
  }, []);

  return (
    <div>
      <h1>Appointments</h1>
      {error && <p className="page-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Service Type" value={serviceType} onChange={(e) => setServiceType(e.target.value)} required />
        <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />

        <button type="submit">Add Appointment</button>
      </form>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id}>{appointment.service_type + " - " + appointment.appointment_date + " - " + appointment.start_time + " to " + appointment.end_time + " - " + appointment.status + " - " + getCustomerName(appointment.customer_id)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentsPage;
