import { useState, useEffect } from "react";

export function Output() {
  const [config, setConfig] = useState(null);
  const [buttonRef, setButtonRef] = useState(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem("buttonConfig");
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const executeActions = async () => {
    if (!config || !config.actions || !config.actions.length) return;

    for (const action of config.actions) {
      await executeAction(action);
    }
  };

  const executeAction = async (action) => {
    switch (action.type) {
      case "Alert":
        alert(action.param);
        break;
      case "Show Text": {
        const textElement = document.createElement("div");
        textElement.className = "mt-4 p-3   rounded-md text-black w-auto";
        textElement.textContent = action.param;
        document.getElementById("outputContainer").appendChild(textElement);
        break;
      }
      case "Show Image": {
        const imgContainer = document.createElement("div");
        const img = document.createElement("img");
        img.src = action.param;
        img.className = "max-w-full h-auto rounded-md";
        img.alt = "Dynamic image";
        imgContainer.appendChild(img);
        document.getElementById("outputContainer").appendChild(imgContainer);
        break;
      }
      case "Refresh Page":
        window.location.reload();
        break;
      case "Set LocalStorage":
        try {
          const [key, value] = action.param.split(":");
          localStorage.setItem(key.trim(), value.trim());
        } catch (e) {
          console.error("Invalid format for localStorage", e);
        }
        break;
      case "Get LocalStorage":
        try {
          const value = localStorage.getItem(action.param);
          const resultElement = document.createElement("div");
          resultElement.className = "mt-4 p-3  rounded-md";
          resultElement.textContent = `${action.param}: ${
            value || "Not found"
          }`;
          document.getElementById("outputContainer").appendChild(resultElement);
        } catch (e) {
          console.error("Error getting from localStorage", e);
        }
        break;
      case "Increase Button Size":
        if (buttonRef) {
          const currentSize = Number.parseInt(
            window.getComputedStyle(buttonRef).fontSize
          );
          const newSize = currentSize + Number.parseInt(action.param || 2);
          buttonRef.style.fontSize = `${newSize}px`;
        }
        break;
      case "Close Window": {
        const closeMsg = document.createElement("div");
        closeMsg.className =
          "mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md";
        closeMsg.textContent =
          "Window close action triggered (disabled for demo)";
        document.getElementById("outputContainer").appendChild(closeMsg);
        break;
      }
      case "Prompt and Show": {
        const userInput = prompt(action.param);
        if (userInput !== null) {
          const promptResult = document.createElement("div");
          promptResult.className = "mt-4 p-3   rounded-md";
          promptResult.textContent = `You entered: ${userInput}`;
          document.getElementById("outputContainer").appendChild(promptResult);
        }
        break;
      }
      case "Change Button Color":
        if (buttonRef) {
          buttonRef.style.backgroundColor = action.param;
        }
        break;
      case "Disable Button":
        if (buttonRef) {
          buttonRef.disabled = true;
          buttonRef.classList.add("opacity-50", "cursor-not-allowed");
        }
        break;
      default:
        console.log("Unknown action type:", action.type);
    }

    return new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <div className="min-h-screen relative">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold">Output Page</h1>
        <div>
          {config ? (
            <div>
              <button ref={setButtonRef} onClick={executeActions}>
                {config.buttonLabel ? config.buttonLabel : "start"}
              </button>
              <div id="outputContainer"></div>
            </div>
          ) : (
            <div>No button configuration found.</div>
          )}
        </div>
      </div>
      <button
        className="fixed bottom-6 right-6 px-6 py-2  rounded-md"
        onClick={() => (window.location.href = "/")}
      >
        Back to Configuration
      </button>
    </div>
  );
}
