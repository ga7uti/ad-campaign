import { Box, Typography } from "@mui/material";

export default function CardSection({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;

  }): React.JSX.Element {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "row",
          },
          justifyContent: "space-between",
          alignItems: "center",
          gap: { xs: 2, sm: 3, md: 4 },
          p: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", 
            alignItems: "center", 
            height: "100%",
          }}
        >
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Box sx={{ flex: { xs: "1", md: "2", lg: "3" }, overflow: "hidden" }}>
          {children}
        </Box>
      </Box>
    );
  }