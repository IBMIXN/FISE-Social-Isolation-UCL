import { Provider } from "next-auth/client";
import { ThemeProvider, CSSReset, DarkMode } from "@chakra-ui/core";

import theme from "../theme";
import "../utils/global.css";

const App = ({ Component, pageProps }) => {
  const { session } = pageProps;
  return (
    <Provider options={{ site: process.env.NEXTAUTH_URL }} session={session}>
      <ThemeProvider theme={theme}>
        <DarkMode>
          <CSSReset />
          <Component {...pageProps} />
        </DarkMode>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
