import React from "react";

const HomePage = () => {
  return (
    <div className="page">
      <h1>Randevu Yönetim Paneli</h1>
      <p className="page-description">
        Küçük işletmeler için müşteri ve randevu akışlarını tek yerden yönetin.
      </p>
      <section className="info-card">
        <h2>Müşteriler</h2>
        <p>Müşteri kayıtlarını ekleyin, görüntüleyin ve güncelleyin.</p>
      </section>
      <section className="info-card">
        <h2>Randevular</h2>
        <p>Randevu oluşturun, durumlarını takip edin ve takvimi düzenli tutun.</p>
      </section>
    </div>
  );
};

export default HomePage;
