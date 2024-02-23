import { CSS } from "@lib/utils";
import { ConversationList } from "./ConversationList";
import { getLoggedInUser } from "@app/actions";

const inboxStyle: CSS = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  height: "100%",
  width: "100%",
  border: "1px solid #000",
};

export const AppointmentInbox = async () => {
  const user = await getLoggedInUser();

  if (!user) {
    return <div style={inboxStyle}>User not logged in.</div>;
  }

  return (
    <div style={inboxStyle}>
      <ConversationList user={user} />
    </div>
  );
};
