
import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (preview) URL.revokeObjectURL(preview);

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

      setResult(await response.json());
    } catch {
      setError(
        "Unable to connect to the AI backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const category = (result?.predicted_category || "").toLowerCase();
  const showPrivacyGuidance =
    result?.identified &&
    ["mobile_accessories", "computer_components"].includes(category);

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">♻️ EcoAssist</a>
        <nav aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#scanner">E-Waste Scanner</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">SMARTER RECYCLING STARTS HERE</span>
            <h1>Give Your E-Waste a <span>Better Future.</span></h1>
            <p>
              Identify electronic waste with AI and get practical guidance
              for safer handling and responsible disposal.
            </p>
            <a className="hero-button" href="#scanner">
              Identify Your E-Waste ↓
            </a>
          </div>
          <div className="hero-card">
            <span className="hero-icon">🌱</span>
            <h3>Small Actions. Big Impact.</h3>
            <p>
              Responsible e-waste disposal helps protect people and the
              environment from hazardous electronic waste.
            </p>
            <div className="hero-card-line">♻️ Reduce · Reuse · Recycle</div>
          </div>
        </section>

        <section className="scanner-section" id="scanner">
          <div className="section-heading">
            <span className="eyebrow">AI-POWERED IDENTIFICATION</span>
            <h2>Identify Your E-Waste</h2>
            <p>Upload an image to receive a predicted category and disposal advice.</p>
          </div>

          <div className="container">
            <section className="upload-card">
              <h2>📷 Upload an Image</h2>
              <p className="description">
                Choose a clear image of an electronic item. Supported formats:
                PNG and JPEG.
              </p>

              <label className="upload-box">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                />
                <span>📁 Choose an image</span>
                <small>Click here to browse your files</small>
              </label>

              {preview && (
                <div className="preview">
                  <h3>Image Preview</h3>
                  <img src={preview} alt="Selected e-waste item" />
                  <p>{file?.name}</p>
                </div>
              )}

              <button
                className="identify-button"
                onClick={identifyEwaste}
                disabled={loading}
              >
                {loading ? "🔄 Identifying..." : "🔍 Identify E-Waste"}
              </button>

              {error && <p className="error" role="alert">⚠️ {error}</p>}
            </section>

            <section className="result-card" aria-live="polite">
              <h2>♻️ Prediction Result</h2>

              {!result && !loading && (
                <div className="result-placeholder">
                  <span>🤖</span>
                  <p>Your prediction and disposal guidance will appear here.</p>
                </div>
              )}

              {loading && (
                <div className="result-placeholder">
                  <span>🔄</span>
                  <p>AI is analyzing your image...</p>
                </div>
              )}

              {result && (
                <div className="result">
                  <div className="prediction">
                    <span>Identified Category</span>
                    <strong>
                      {(result.predicted_category || "Unknown").replaceAll("_", " ")}
                    </strong>
                  </div>

                  <div className="confidence">
                    <span>Model Confidence</span>
                    <strong>{result.confidence}%</strong>
                  </div>

                  {!result.identified && (
                    <div className="warning">
                      ⚠️ Manual verification required. Do not rely on this
                      prediction alone.
                    </div>
                  )}

                  {result.disposal_guidance && (
                    <div className="guidance">
                      <h3>♻️ Disposal Guidance</h3>
                      <p><strong>Action:</strong> {result.disposal_guidance.action}</p>
                      <p><strong>Safety:</strong> {result.disposal_guidance.safety_warning}</p>
                      <p><strong>Handling:</strong> {result.disposal_guidance.handling}</p>
                    </div>
                  )}

                  {showPrivacyGuidance && (
                    <div className="privacy-guidance">
                      <h3>🔐 Check for Personal Data</h3>
                      <p>
                        The model predicts a broad category and cannot confirm
                        the exact device. Follow the advice below only if it
                        applies to the item you actually have.
                      </p>

                      {category === "mobile_accessories" && (
                        <>
                          <h4>If this is a phone, tablet, or data-storing device</h4>
                          <ul>
                            <li>Back up any data you want to keep.</li>
                            <li>Sign out of accounts and remove the device from your accounts where appropriate.</li>
                            <li>Perform a factory reset using the manufacturer's instructions, if the device supports it.</li>
                            <li>Remove SIM cards and memory cards before recycling.</li>
                          </ul>
                        </>
                      )}

                      {category === "computer_components" && (
                        <>
                          <h4>If this is an HDD, SSD, USB drive, or other storage device</h4>
                          <ul>
                            <li>Back up any files you need.</li>
                            <li>Use an appropriate secure data-erasure method for the specific drive.</li>
                            <li>If the drive is faulty or cannot be erased, ask an authorized recycler about secure data destruction.</li>
                            <li>Do not assume deleting files or formatting a drive securely erases all data.</li>
                          </ul>
                        </>
                      )}

                      <p className="privacy-note">
                        If the item does not store personal data, these steps
                        may not apply. Never dismantle batteries or electronics
                        unsafely to remove storage components.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
          <p className="local-privacy-note">
            Privacy tip: upload only images you have permission to use, and
            avoid including faces, documents, or other personal information.
          </p>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="section-heading">
            <span className="eyebrow">THREE SIMPLE STEPS</span>
            <h2>How It Works</h2>
            <p>From identifying an item to making a more informed disposal decision.</p>
          </div>

          <div className="steps">
            <article className="step-card">
              <span className="step-icon">📸</span>
              <span className="step-number">STEP 01</span>
              <h3>Upload</h3>
              <p>Select a clear picture of the electronic item you want to identify.</p>
            </article>
            <article className="step-card">
              <span className="step-icon">🤖</span>
              <span className="step-number">STEP 02</span>
              <h3>Identify</h3>
              <p>The trained AI model predicts the item's e-waste category and confidence.</p>
            </article>
            <article className="step-card">
              <span className="step-icon">♻️</span>
              <span className="step-number">STEP 03</span>
              <h3>Dispose Responsibly</h3>
              <p>Review the handling advice and consult an authorized e-waste recycler.</p>
            </article>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-content">
            <span className="eyebrow">ABOUT THE PROJECT</span>
            <h2>Technology for Responsible E-Waste Management</h2>
            <p>
              AI E-Waste Assistant is a project that combines image
              classification with practical disposal guidance. It aims to help
              users make more informed decisions when handling electronic waste.
            </p>
            <p>
              The model currently predicts three broad categories: batteries,
              computer components, and mobile accessories. Its prediction is
              not a substitute for expert inspection or local recycling rules.
            </p>
          </div>
          <div className="about-symbol" aria-hidden="true">♻️</div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#home">♻️ EcoAssist</a>
        <p>Make responsible choices. Help keep electronic waste out of landfills.</p>
        <p className="footer-warning">
          AI predictions are for guidance only. Follow local regulations and
          use authorized e-waste collection facilities.
        </p>
        <span>AI E-Waste Assistant</span>
      </footer>
    </div>
  );
}

export default App;
