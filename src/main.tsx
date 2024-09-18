import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Buffer } from "buffer";
import { createTheme, ThemeProvider } from "@mui/material/styles";

window.Buffer = Buffer;

const queryClient = new QueryClient();

const theme = createTheme({
  typography: {
    fontFamily: '"Noto Sans Thai", sans-serif',
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </QueryClientProvider>
);
