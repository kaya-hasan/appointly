import React, { useEffect, useState } from "react";
import customerService from "../services/customerService";
import appointmentService from "../services/appointmentService";

const HomePage = () => {
  const [customers, setCustomers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([customerService.getCustomers(), appointmentService.getAppointments()])
      .then(([customers, appointments]) => {
        setCustomers(customers);
        setAppointments(appointments);
      })
      .catch(() => {
        setError("Failed to load dashboard data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const totalAppointments = appointments.length;
  const totalCustomers = customers.length;
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
  ).length;
  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  ).length;
  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === "cancelled"
  ).length;

  return (
    <div className="page">
      <h1>Randevu Yönetim Paneli</h1>
      <p className="page-description">
        Küçük işletmeler için müşteri ve randevu akışlarını tek yerden yönetin.
      </p>

      {loading ? (
        <p className="empty-state">Loading dashboard data...</p>
      ) : error ? (
        <p className="page-error">{error}</p>
      ) : (
        <>
          <div className="stats-grid">
            <section className="stat-card">
              <p className="stat-label">Toplam Müşteri</p>
              <p className="stat-value">{totalCustomers}</p>
            </section>

            <section className="stat-card">
              <p className="stat-label">Toplam Randevu</p>
              <p className="stat-value">{totalAppointments}</p>
            </section>

            <section className="stat-card">
              <p className="stat-label">Bekleyen</p>
              <p className="stat-value">{pendingAppointments}</p>
            </section>

            <section className="stat-card">
              <p className="stat-label">Onaylanan</p>
              <p className="stat-value">{confirmedAppointments}</p>
            </section>

            <section className="stat-card">
              <p className="stat-label">İptal Edilen</p>
              <p className="stat-value">{cancelledAppointments}</p>
            </section>
          </div>

          <section className="info-card">
            <h2>Genel Durum</h2>
            <p>Müşteri kayıtlarını, randevu yoğunluğunu ve durum dağılımını tek ekranda takip edin.</p>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;
