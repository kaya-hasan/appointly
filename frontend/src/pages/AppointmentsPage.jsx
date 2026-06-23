import React, { useEffect, useState } from "react";
import appointmentService from "../services/appointmentService";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [serviceType, setServiceType] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [status, setStatus] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [endTime, setEndTime] = useState("");

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

    await appointmentService.createAppointment(appointment);
    const updatedAppointments = await appointmentService.getAppointments();
    setAppointments(updatedAppointments);

    setServiceType("");
    setAppointmentDate("");
    setStartTime("");
    setStatus("");
    setCustomerId("");
    setEndTime("");
  }

  useEffect(() => {
    appointmentService.getAppointments().then(setAppointments);
  }, []);

  return (
    <div>
      <h1>Appointments</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Service Type" value={serviceType} onChange={(e) => setServiceType(e.target.value)} />
        <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        <input type="text" placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)} />
        <input type="text" placeholder="Customer ID" value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

        <button type="submit">Add</button>
      </form>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>{appointment.service_type + " - " + appointment.appointment_date + " - " + appointment.start_time + " - " + appointment.status + " - " + appointment.customer_id + " - " + appointment.end_time}</li>
        ))}

      </ul>
    </div>
  );
};

export default AppointmentsPage;
