import React, { useState } from "react";
import AlertContext from "./AlertContext";

const AlertState = (props) => {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      message: message,
      type: type,
    });
    setTimeout(() => {
      setAlert();
    }, 2000);
  };

  return (
    <div>
      <AlertContext.Provider value={{ alert, showAlert }}>{props.children}</AlertContext.Provider>
    </div>
  );
};

export default AlertState;
