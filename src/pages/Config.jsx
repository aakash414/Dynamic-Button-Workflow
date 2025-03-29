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

  const moveActionUp = (index) => {
    if (index === 0) return;

    const newActions = [...actions];
    const temp = newActions[index];
    newActions[index] = newActions[index - 1];
    newActions[index - 1] = temp;

    setActions(newActions);
  };

  const moveActionDown = (index) => {
    if (index === actions.length - 1) return;

    const newActions = [...actions];
    const temp = newActions[index];
    newActions[index] = newActions[index + 1];
    newActions[index + 1] = temp;

    setActions(newActions);
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
        <div className="flex flex-col gap-10  rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Button Settings</h2>{" "}
          <div>
            <label className="text-sm font-lg mb-1">Button Label</label>
            <input
              type="text"
              value={buttonLabel}
              onChange={(e) => setButtonLabel(e.target.value)}
              className="w-auto px-4 py-2 border  rounded-md  "
            />
          </div>
          <div className="flex  flex-col">
            <div>
              <label>Select Action:</label>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-auto px-4 py-2 border  rounded-md"
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
                <div>
                  <label className="w-1/2 text-sm font-lg mb-1">
                    {paramLabel}
                  </label>
                  <input
                    type="text"
                    value={actionParam}
                    onChange={(e) => setActionParam(e.target.value)}
                    placeholder={paramPlaceholder}
                    className="w-1/2 px-4 py-2 border rounded-md "
                  />
                </div>
              </>
            )}
            <button onClick={addAction} className="px-4 mt-2 rounded-md">
              Add Action
            </button>
          </div>
        </div>
        <div className=" rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Action Workflow</h2>

          {actions.length === 0 ? (
            <p className="text-gray-500 italic">
              No actions added yet. Add actions above to create your workflow.
            </p>
          ) : (
            <ul className="space-y-2">
              {actions.map((action, index) => (
                <li
                  key={action.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                >
                  <div>
                    <span className="font-medium ">
                      {index + 1}. {action.type}
                    </span>
                    {action.param && (
                      <span className="ml-2 text-gray-600">
                        - {action.param}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveActionUp(index)}
                      disabled={index === 0}
                      className="px-2 py-1"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveActionDown(index)}
                      disabled={index === actions.length - 1}
                      className="px-2 py-1"
                      aria-label="Move action down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeAction(action.id)}
                      className="px-2 py-1 text-red-500 hover:text-red-700"
                      aria-label="Remove action"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={saveConfiguration}>Save & Go to Output</button>
        </div>
      </div>
    </div>
  );
}
