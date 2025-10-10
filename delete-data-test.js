tripRepository.findAll().then(trips => console.table(trips.map(t => ({
  id: t.id,
  status: t.status,
  gpsPoints: t.gpsPoints?.length || 0
}))));