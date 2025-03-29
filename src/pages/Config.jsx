import { useState, useEffect } from "react";

export function Config() {
  const [buttonLabel, setButtonLabel] = useState("");
  const [selectedAction, setSelectedAction] = useState("Alert");
  const [actionParam, setActionParam] = useState("");
  const [actions, setActions] = useState([]);
  const [paramPlaceholder, setParamPlaceholder] = useState(
    "Enter alert message"
  );
  const [paramLabel, setParamLabel] = useState("Alert Message:");

  useEffect(() => {
    const paramSettings = {
      Alert: ["Enter alert message", "Alert Message:"],
      "Show Text": ["Enter text to display", "Text Content:"],
      "Show Image": ["Enter image URL", "Image URL:"],
      "Set LocalStorage": ["key:value", "Key:Value Pair:"],
      "Get LocalStorage": ["Enter key name", "Key Name:"],
      "Increase Button Size": ["Enter size in pixels", "Size Increase (px):"],
      "Change Button Color": ["Enter color", "Button Color:"],
      "Prompt and Show": ["Enter prompt message", "Prompt Message:"],
      "Refresh Page": [null, ""],
      "Close Window": [null, ""],
      "Disable Button": [null, ""],
    };
    setParamPlaceholder(paramSettings[selectedAction]?.[0] || "");
    setParamLabel(paramSettings[selectedAction]?.[1] || "");
  }, [selectedAction]);

  const actionRequiresParam = () => {
    return !["Refresh Page", "Close Window", "Disable Button"].includes(
      selectedAction
    );
  };

  const addAction = () => {
    setActions([
      ...actions,
      {
        id: Date.now(),
        type: selectedAction,
        param: actionRequiresParam() ? actionParam : null,
      },
    ]);
    setActionParam("");
  };

  const removeAction = (id) => {
    setActions(actions.filter((action) => action.id !== id));
  };

  const saveConfiguration = () => {
    localStorage.setItem(
      "buttonConfig",
      JSON.stringify({ buttonLabel, actions })
    );
    window.location.href = "/output";
  };

  return (
    <div className="flex flex-col w-full h-full ">
      <div className="max-w-4xl mx-auto p-6">
        <h1>Config Page</h1>
        <div>
          <label>Button Label:</label>
          <input
            type="text"
            value={buttonLabel}
            onChange={(e) => setButtonLabel(e.target.value)}
          />
          <label>Select Action:</label>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
          >
            {[
              "Alert",
              "Show Text",
              "Show Image",
              "Refresh Page",
              "Set LocalStorage",
              "Get LocalStorage",
              "Increase Button Size",
              "Close Window",
              "Prompt and Show",
              "Change Button Color",
              "Disable Button",
            ].map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>
        {actionRequiresParam() && (
          <>
            <label>{paramLabel}</label>
            <input
              type="text"
              value={actionParam}
              onChange={(e) => setActionParam(e.target.value)}
              placeholder={paramPlaceholder}
            />
          </>
        )}
        <button onClick={addAction}>Add Action</button>
        <ul>
          {actions.map((action) => (
            <li key={action.id}>
              {action.type} {action.param && `- ${action.param}`}
              <button onClick={() => removeAction(action.id)}>Remove</button>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={saveConfiguration}>Save & Go to Output</button>
        </div>
      </div>
    </div>
  );
}
