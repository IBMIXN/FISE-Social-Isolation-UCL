import { Provider } from "next-auth/client";
import { ThemeProvider, CSSReset, DarkMode } from "@chakra-ui/core";

import theme from "../theme";

const App = ({ Component, pageProps }) => {
  const { session } = pageProps;
  return (
    <Provider options={{ site: process.env.SITE }} session={session}>
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
