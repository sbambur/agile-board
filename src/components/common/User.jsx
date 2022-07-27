import { Avatar } from "@mui/material";
import { Box } from "@mui/system";

export default function User({ user }) {
  return (
    <Box display="flex">
      <Avatar src={user?.avatar} alt={user?.name} />
      <span style={{ padding: 5 }}>{user?.name}</span>
    </Box>
  );
}
