import { useState } from "react";
import "./Help.css";

function Help() {
  const [search, setSearch] = useState("");
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      question: "How can I search for a train?",
      answer:
        "Go to the Train Search section and enter your source, destination and journey date to find available trains.",
    },
    {
      question: "How can I book a train ticket?",
      answer:
        "Search for your train, select the required class, enter passenger details and confirm your booking.",
    },
    {
      question: "How can I check my PNR status?",
      answer:
        "Open the PNR Status section and enter your PNR number to check your booking status.",
    },
    {
      question: "Can I cancel my ticket?",
      answer:
        "Yes. Go to the Cancellation section, enter your booking details and follow the cancellation process.",
    },
    {
      question: "How can I update my profile?",
      answer:
        "Open your Profile section and select Edit Profile to update your personal information.",
    },
    {
      question: "Where can I find railway travel tips?",
      answer:
        "Visit the Railway Tips section in Community to find useful tips for a safe and comfortable journey.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (question.trim() === "") return;

    setSubmitted(true);
    setQuestion("");

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="help-page">

      {/* Header */}
      <div className="help-header">
        <h1>How Can We Help?</h1>
        <p>
          Find answers to common questions about RailMate and railway travel.
        </p>
      </div>

      {/* Search */}
      <div className="help-search-container">
        <input
          type="text"
          placeholder="Search your question..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="help-search"
        />
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>

        {filteredFaqs.length > 0 ? (
          <div className="faq-list">
            {filteredFaqs.map((faq, index) => (
              <div className="faq-card" key={index}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No results found</h3>
            <p>Try searching with a different question.</p>
          </div>
        )}
      </div>

      {/* Ask Question */}
      <div className="ask-question">
        <h2>Still Need Help?</h2>
        <p>
          Didn't find the answer you were looking for? Ask the RailMate
          community.
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Write your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button type="submit">Submit Question</button>
        </form>

        {submitted && (
          <p className="success-message">
            Your question has been submitted successfully!
          </p>
        )}
      </div>

    </div>
  );
}

export default Help;