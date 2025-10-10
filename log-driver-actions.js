(async () => {
  console.log("🧪 Démarrage du test de journalisation...");

  // 1. Vérifier que les repositories sont bien définis
  if (typeof dayLogRepository === "undefined") {
    console.error("❌ dayLogRepository non défini. As-tu ajouté le code ?");
    return;
  }

  // 2. Simuler une journée complète
  const ownerId = appState.currentOwnerId;
  const driverId = appState.currentDriverId;

  // Démarrage de la journée
  await logDriverAction("start_day", {
    timestamp: Date.now(),
    gpsPosition: { lat: -4.7692, lng: 11.8636 }
  });

  // Pause
  appState.pauseStartTime = Date.now();
  await logDriverAction("pause_start", { timestamp: appState.pauseStartTime });

  // Reprise
  await logDriverAction("pause_end", {
    timestamp: Date.now(),
    pauseDuration: 120000 // 2 min
  });

  // Début de course
  await logDriverAction("trip_start", {
    tripId: "trip_test_001",
    amount: 2500,
    passengers: 2,
    startPosition: { lat: -4.7700, lng: 11.8650 },
    timestamp: Date.now()
  });

  // Fin de course
  await logDriverAction("trip_end", {
    tripId: "trip_test_001",
    distance: 1.8,
    duration: 180, // secondes
    endPosition: { lat: -4.7750, lng: 11.8730 },
    timestamp: Date.now()
  });

  // Fin de journée
  await logDriverAction("end_day", {
    totalTrips: 1,
    totalEarnings: 2500,
    timestamp: Date.now()
  });

  console.log("✅ Toutes les actions ont été journalisées.");

  // 3. Charger et afficher le journal
  const logs = await dayLogRepository.findAll({ ownerId, driverId });
  console.log(`📋 Journal chargé : ${logs.length} entrées`);
  console.table(logs.map(l => ({
    type: l.type,
    heure: new Date(l.timestamp).toLocaleTimeString(),
    metadata: JSON.stringify(l.metadata)
  })));

  // 4. Vérification : chaque type d’action doit être présent
  const types = logs.map(l => l.type);
  const expected = ["start_day", "pause_start", "pause_end", "trip_start", "trip_end", "end_day"];
  const missing = expected.filter(t => !types.includes(t));

  if (missing.length === 0) {
    console.log("🎉 Test réussi : toutes les actions sont journalisées !");
  } else {
    console.warn("⚠️ Actions manquantes :", missing);
  }
})();