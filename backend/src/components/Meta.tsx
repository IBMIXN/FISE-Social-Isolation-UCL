import Head from 'next/head';

const title = 'UCL FinTech Society';
const description =
    "Join Europe's largest student-led FinTech society for free today to get exclusive access to talks from leaders in the FinTech space!";

export default () => (
    <Head>
        <meta charSet="utf-8" />
        <title>FISE Parlour</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="og:title" property="og:title" content={title} />
        <meta name="og:description" property="og:description" content={description} />
        <meta property="og:site_name" content="" />
        <meta property="og:url" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:site" content="@uclfintechsoc" />
        <meta name="twitter:creator" content="@adamnpeace" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta property="og:image" content="/og_image.png" />
        <meta name="twitter:image" content="/og_image.png" />
        <link rel="canonical" href="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <meta name="theme-color" content={theme.colors.primary()} /> */}

        <link rel="manifest" href="/manifest.json" />

        {/* <style type="text/css">
            {`
                    body {
                        background-color: ;
                        margin: 0;
                        overflow-x: hidden;
                    }
                    `}
        </style> */}
    </Head>
);
