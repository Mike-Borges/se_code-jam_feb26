import "./ContactList.css";

const demoContacts = Array.from({ length: 7 }).map((_, i) => ({
  id: i + 1,
  name: `Name Goes Here`,
}));

export default function ContactList({ title = "Contacts" }) {
  return (
    <aside className="card contacts">
      <div className="contacts__header">{title}</div>
      <div className="contacts__list">
        {demoContacts.map((c) => (
          <button key={c.id} className="contacts__row" type="button">
            <div className="contacts__avatar" aria-hidden="true" />
            <div className="contacts__name">{c.name}</div>
            <div className="contacts__icon" aria-hidden="true">
              ✎
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
