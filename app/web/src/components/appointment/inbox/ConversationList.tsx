"use client";

import { CSS } from "@lib/utils";

const listStyle: CSS = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  height: "100%",
  flexBasis: `${100 / 3}%`,
  border: "1px solid #000",
};

export const ConversationList = () => {
  return (
    <div style={listStyle}>
      <header>
        <h1>Appointment List</h1>
      </header>
    </div>
  );
};
