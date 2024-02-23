import { CSS } from "@lib/utils";
import { ConversationList } from "./ConversationList";

const inboxStyle: CSS = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  height: "100%",
  width: "100%",
  border: "1px solid #000",
};

export const AppointmentInbox = () => {
  return (
    <div style={inboxStyle}>
      <ConversationList />
    </div>
  );
};
