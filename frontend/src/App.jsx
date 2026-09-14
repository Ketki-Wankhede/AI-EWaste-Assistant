import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
  };

  const identifyEwaste = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        "Unable to connect to the AI backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      <header className="header">
        <h1>♻️ AI E-Waste Assistant</h1>
        <p>
          Identify electronic waste and get safe disposal guidance.
        </p>
      </header>

      <main className="container">

        <section className="upload-card">
          <h2>Identify Your E-Waste</h2>

          <p className="description">
            Upload an image of an electronic item to identify its category.
          </p>

          <label className="upload-box">
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
            />

            <span>📷 Choose an image</span>
            <small>PNG or JPEG</small>
          </label>

          {preview && (
            <div className="preview">
              <h3>Image Preview</h3>
              <img src={preview} alt="Selected e-waste" />
            </div>
          )}

          <button
            className="identify-button"
            onClick={identifyEwaste}
            disabled={loading}
          >
            {loading ? "🔄 Identifying..." : "🔍 Identify E-Waste"}
          </button>

          {error && (
            <p className="error">
              ⚠️ {error}
            </p>
          )}
        </section>

        <section className="result-card">
          <h2>Prediction Result</h2>

          {!result && !loading && (
            <div className="result-placeholder">
              <span>🤖</span>
              <p>
                Upload an image and click Identify E-Waste.
              </p>
            </div>
          )}

          {loading && (
            <div className="result-placeholder">
              <span>🔄</span>
              <p>AI is analyzing the image...</p>
            </div>
          )}

          {result && (
            <div className="result">

              <div className="prediction">
                <span>Identified Category</span>
                <strong>
                  {result.predicted_category.replaceAll("_", " ")}
                </strong>
              </div>

              <div className="confidence">
                <span>Confidence</span>
                <strong>{result.confidence}%</strong>
              </div>

              {!result.identified && (
                <div className="warning">
                  ⚠️ Manual Verification Required
                </div>
              )}

              {result.disposal_guidance && (
                <div className="guidance">

                  <h3>♻️ Disposal Guidance</h3>

                  <p>
                    <strong>Action:</strong>{" "}
                    {result.disposal_guidance.action}
                  </p>

                  <p>
                    <strong>Safety:</strong>{" "}
                    {result.disposal_guidance.safety_warning}
                  </p>

                  <p>
                    <strong>Handling:</strong>{" "}
                    {result.disposal_guidance.handling}
                  </p>

                </div>
              )}

            </div>
          )}
        </section>

      </main>

      <footer>
        <p>
          ⚠️ AI predictions are for guidance only. Follow safe e-waste
          handling practices.
        </p>
      </footer>

    </div>
  );
}

export default App;