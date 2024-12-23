// En el dashboard, agrega estos estados y funciones:

const [showWelcome, setShowWelcome] = useState(false);

useEffect(() => {
  checkUser();
  // Verificar si es la primera visita
  const hasVisited = storage.get('hasVisitedDashboard');
  if (!hasVisited) {
    setShowWelcome(true);
    storage.set('hasVisitedDashboard', 'true');
  }
}, []);

const handleCloseWelcome = () => {
  setShowWelcome(false);
};

// Agrega el componente del popup justo antes del cierre del return
return (
  <div className="min-h-screen bg-gray-50">
    {/* ... resto del código del dashboard ... */}

    {/* Welcome Popup */}
    {showWelcome && profile && (
      <WelcomePopup
        userName={profile.full_name}
        subscriptionStatus={profile.subscription_status}
        trialEnd={profile.trial_end}
        onClose={handleCloseWelcome}
      />
    )}
  </div>
);
