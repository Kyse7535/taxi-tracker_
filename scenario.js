(async () => {
  const ownerId = "own_taxi_123";
  const driverId = "drv_mbemba_jean";

  // 1. Créer et sauvegarder une course
  const trip = new Trip({
    amount: 2000,
    passengers: 1,
    startPosition: { lat: -4.7692, lng: 11.8636 },
    startTime: Date.now(),
    status: "active",
    driverId,
    ownerId,
  });
  const saved = await tripRepository.save(trip);
  console.log("✅ Course créée:", saved.id);

  // 2. La terminer immédiatement (pour test)
  await tripRepository.update(saved.id, {
    endPosition: { lat: -4.7750, lng: 11.8730 },
    endTime: Date.now(),
    distance: 1.5,
    duration: 120000,
    zone: "centre-ville",
    status: "completed",
  });
  console.log("🏁 Course terminée");

  // 3. Charger l’historique
  await loadTripHistory();
  const list = document.getElementById("trip-history-list").innerHTML;
  console.log(list.includes("Aucune course") ? "❌ Toujours vide" : "✅ Historique OK");

  // 4. Afficher les détails
  await showTripDetails(saved.id);
})();