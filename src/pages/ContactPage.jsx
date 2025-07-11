import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/contact.css";
import Header from "../components/Header";

export default function ContactPage() {
  const [contact, setContact] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5145/api/contact")
      .then((res) => setContact(res.data))
      .catch(() => setError("Failed to load contact information"));
  }, []);

  return (
    <>
      <Header />
      <div className="contact-container">
        <h1 className="contact-title">Contact Us</h1>
        {error && <div className="error">{error}</div>}
        {contact && (
          <div className="contact-info">
            <p><strong>Email:</strong> {contact.email}</p>
            <p><strong>Phone:</strong> {contact.phone}</p>
          </div>
        )}
      </div>
    </>
  );
}
