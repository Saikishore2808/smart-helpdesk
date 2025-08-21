export default function KBManager() {
  const articles = [
    { id: 1, question: "How to reset my password?", answer: "Click on Forgot Password at login." },
    { id: 2, question: "Refund process?", answer: "Contact billing within 7 days." },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Knowledge Base</h1>
      <ul className="space-y-3">
        {articles.map((a) => (
          <li key={a.id} className="border p-3 rounded">
            <p className="font-semibold">{a.question}</p>
            <p className="text-sm text-gray-600">{a.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
