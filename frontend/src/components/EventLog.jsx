export function EventLog({ events }) {
  return (
    <section className="panel">
      <h2>Eventos Processados</h2>
      <div className="event-list">
        {events.map((event) => (
          <article key={event.id} className="event-item">
            <strong>{event.eventType}</strong>
            <span>{event.eventId}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
