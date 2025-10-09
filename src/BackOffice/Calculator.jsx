import { useState } from "react";
import { FaCalculator, FaTimes } from "react-icons/fa";

const Calculator = () => {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput("");
    setResult("");
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      // Evaluate mathematical expression safely
      const evalResult = eval(input.replace(/[^-()\d/*+.]/g, ""));
      setResult(evalResult);
    } catch {
      setResult("Error");
    }
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        className="btn btn-primary d-flex align-items-center gap-2"
        onClick={() => setShow(true)}
      >
        <FaCalculator /> Open Calculator
      </button>

      {/* Modal */}
      {show && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content"
              style={{
                borderRadius: "15px",
                overflow: "hidden",
              }}
            >
              <div
                className="modal-header text-white"
                style={{ backgroundColor: "#3c51a1" }}
              >
                <h5 className="modal-title">
                  <FaCalculator className="me-2" />
                  Calculator
                </h5>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => setShow(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body bg-light">
                {/* Display */}
                <div
                  className="mb-3 p-3 rounded text-end bg-white shadow-sm"
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    minHeight: "60px",
                    border: "1px solid #ddd",
                  }}
                >
                  {result ? <div>{result}</div> : input || "0"}
                </div>

                {/* Buttons */}
                <div className="d-grid gap-2">
                  {[
                    ["7", "8", "9", "/"],
                    ["4", "5", "6", "*"],
                    ["1", "2", "3", "-"],
                    ["0", ".", "=", "+"],
                  ].map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="d-flex justify-content-between gap-2"
                    >
                      {row.map((btn) => (
                        <button
                          key={btn}
                          className={`btn ${
                            btn === "="
                              ? "btn-success"
                              : isNaN(btn)
                              ? "btn-secondary"
                              : "btn-outline-dark"
                          } flex-fill`}
                          onClick={() =>
                            btn === "=" ? handleCalculate() : handleClick(btn)
                          }
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                  ))}
                  <div className="d-flex justify-content-between gap-2">
                    <button
                      className="btn btn-danger flex-fill"
                      onClick={handleClear}
                    >
                      C
                    </button>
                    <button
                      className="btn btn-warning flex-fill"
                      onClick={handleBackspace}
                    >
                      ⌫
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="modal-footer"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <small className="text-muted">
                  Use for quick arithmetic operations
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
