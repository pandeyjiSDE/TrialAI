import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function GenAIComponent() {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneratedText("");
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/api/generate", {
        prompt,
      });
      setGeneratedText(response.data.generatedText);
    } catch (err) {
      console.error("Frontend error:", err);
      setError("⚠️ Failed to get a response. Please check the backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">
           TrialAI
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            rows="4"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your creative prompt here..."
            className="p-4 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-indigo-600 text-white font-medium text-lg rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 transition-all duration-200"
          >
            {isLoading ? "⚡ Generating..." : "🚀 Generate Text"}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-red-500 text-center font-medium">{error}</p>
        )}

        {/* Output */}
        {generatedText && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-inner">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              📝 Generated Output:
            </h2>
            <div className="prose prose-indigo max-w-none">
              <ReactMarkdown>{generatedText}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenAIComponent;
