import React, { useEffect, useState } from "react";
import customerService from "../services/customerService";
import appointmentService from "../services/appointmentService";

const HomePage = ({ language }) => {
  const [customers, setCustomers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const content = language === "tr"
    ? {
      title: "Randevu Yönetim Paneli",
      description: "Küçük işletmeler için müşteri ve randevu akışlarını tek yerden yönetin.",
      loading: "Dashboard verileri yükleniyor...",
      error: "Dashboard verileri yüklenemedi.",
      totalCustomers: "Toplam Müşteri",
      totalAppointments: "Toplam Randevu",
      pending: "Bekleyen",
      confirmed: "Onaylanan",
      cancelled: "İptal Edilen",
      summaryTitle: "Genel Durum",
      summaryText: "Müşteri kayıtlarını, randevu yoğunluğunu ve durum dağılımını tek ekranda takip edin.",
    }
    : {
      title: "Appointment Management Dashboard",
      description: "Manage customer records and appointment flows for small businesses from a single panel.",
      loading: "Loading dashboard data...",
      error: "Failed to load dashboard data.",
      totalCustomers: "Total Customers",
      totalAppointments: "Total Appointments",
      pending: "Pending",
      confirmed: "Confirmed",
      cancelled: "Cancelled",
      summaryTitle: "Overview",
      summaryText: "Track customer records, appointment volume and status distribution from one screen.",
    };

  useEffect(() => {
    setLoading(true);
    Promise.all([customerService.getCustomers(), appointmentService.getAppointments()])
      .then(([customers, appointments]) => {
        setCustomers(customers);
        setAppointments(appointments);
      })
      .catch((err) => {
        setError(err?.detail || content.error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [content.error]);
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
      <h1>{content.title}</h1>
      <p className="page-description">{content.description}</p>

      {loading ? (
        <p className="empty-state">{content.loading}</p>
      ) : error ? (
        <p className="page-error">{error}</p>
      ) : (
        <>
          <div className="stats-grid">
            <section className="stat-card">
              <p className="stat-label">{content.totalCustomers}</p>
              <p className="stat-value">{totalCustomers}</p>
            </section>

            <section className="stat-card">
              <p className="stat-label">{content.totalAppointments}</p>
              <p className="stat-value">{totalAppointments}</p>
            </section>

            <section className="stat-card">
              <p className="stat-label">{content.pending}</p>
              <p className="stat-value">{pendingAppointments}</p>
            </section>

            <section className="stat-card">
              <p className="stat-label">{content.confirmed}</p>
              <p className="stat-value">{confirmedAppointments}</p>
            </section>

            <section className="stat-card">
              <p className="stat-label">{content.cancelled}</p>
              <p className="stat-value">{cancelledAppointments}</p>
            </section>
          </div>

          <section className="info-card">
            <h2>{content.summaryTitle}</h2>
            <p>{content.summaryText}</p>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;
