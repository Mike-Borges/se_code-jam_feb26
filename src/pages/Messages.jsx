import ContactList from "../components/ContactList/ContactList";
import MessageThread from "../components/MessageThread/MessageThread";

export default function Messages() {
  return (
    <div className="layout">
      <MessageThread />
      <ContactList title="Friends" />
    </div>
  );
}
