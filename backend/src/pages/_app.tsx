// import App from 'next/app'
import { SkeletonTheme } from 'react-loading-skeleton';
import useSWR from 'swr';
import fetcher from '../utils/fetcher';
import theme from '../components/theme';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import { Header, Meta } from '../components';

function MyApp({ Component, pageProps }) {
    const { data, error } = useSWR('/api/auth/profile', fetcher);
    return (
        <ThemeProvider theme={theme}>
            <CSSReset />
            <SkeletonTheme color={theme.colors.teal[800]} highlightColor={theme.colors.teal[600]}>
                <Meta />
                <Header />
                <Component {...pageProps} />
            </SkeletonTheme>
        </ThemeProvider>
    );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
