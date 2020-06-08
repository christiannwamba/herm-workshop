---
title: "1.2 Styles and Fonts"
metaTitle: "Styles and Fonts"
metaDescription: "Setup styled-components for a Next.js App -- setup fonts -- add reset.css"
---

Next.js has a bundled styling framework, [styled-jsx](https://github.com/zeit/styled-jsx). `styled-jsx` would work fine but for the sake of simplicity, I decided to go with [Chakra UI](https://chakra-ui.com).

Chakra UI is a modular and accessible component library that gives you all the building blocks you need to build React applications.

If you wanted to create a flex box with some alignment, it will be as straightforward as the following:

```js
// Import Flex from Chakra
import { Flex } from "@chakra-ui/core";

// Create a Flex
<Flex alignItems="center" justifyContent="center">
  
</Flex>;
```

My favorite Chakra feature is the ability to define responsive styles with an array:

```js
<Box
  bg="teal.400"
  width={[
    "100%", // base
    "50%", // 480px upwards
    "25%", // 768px upwards
    "15%", // 992px upwards
  ]}
/>;
{
  /* responsive font size */
}
<Box fontSize={["sm", "md", "lg", "xl"]}>Font Size</Box>;
```

## Objectives

- Setup Chakra UI for a Next.js App
- Add a Google font
- Add a CSS reset and theme

## Exercise 1: Setup Styled Components

Install Chakra and emotion via npm:

```bash
npm install @chakra-ui/core @emotion/core @emotion/styled emotion-theming react-icons
```

Replace the content of `pages/index.js` with:

```js
import React from 'react';
import { Text } from '@chakra-ui/core';

function Index() {
  return (
    <Text fontSize="40px" color="rebeccapurple" as="h1">
      Hello, Herm!
    </Text>
  );
}

export default Index;
```

You should get a nicely colored header.

![](https://paper-attachments.dropbox.com/s_AA9C598A3927718DF41EFCCB3BCF89597B4CC6A74B2279E11E482C3DF767D3C9_1578913168473_image.png)

## Exercise 2: Add a Google font


Next.js has special files that can live in the `pages` folder but are not actual pages. Instead, they wrap pages before Next.js serves those pages from the server:

1. `_document.js` is used to define your own custom HTML and body tags. It is useful for injecting styles and fonts to your _actual_ pages.
2. `_app.js`: Is used to initialize pages. It is useful when you want to do things like maintaining states between two pages, global error handling, retaining layouts across pages, etc.

Since we want to inject styles to the pages, what we need right now is a `pages/_document.js`. Create one and add the following:


```js
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Nunito:400,600&display=swap"
            rel="preload"
            as="style"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

We now have a `render` function like every other React component, but this time we took the opportunity to wrap our page content `<Main />` and page scripts `<NextScript />` with a HTML and body tag. This way, we can inject the global styles and fonts to the `head` of the page.

Set the font-family in the style we already have in `pages/index.js` to see some changes:

```js
function Index() {
  return (
    <Text fontSize="40px" color="rebeccapurple" as="h1" fontFamily="'Nunito', sans-serif">
      Hello, Herm!
    </Text>
  );
}
```

Here you go:

![](https://paper-attachments.dropbox.com/s_AA9C598A3927718DF41EFCCB3BCF89597B4CC6A74B2279E11E482C3DF767D3C9_1578915480006_image.png)

## Exercise 3: Theming and CSS Reset

We have some styling defaults that we don’t need — things like margins around our headings or padding in the body. We want to take full control of everything by resetting everything to 0 or its equivalent.

Chakra also gives you a smooth API to define themes as a global object. With themes you don't have to always remember how to spell your font name or what your primary color is.

We can define both themes and CSS reset in the `pages/_app.js` file.

To do so, create `pages/_app.js` with the following:

(Full path for logo is truncated in the code below but you can copy from: https://gist.github.com/christiannwamba/b73cc2628aff51789f82fb870c0092ae)

```js
import React from 'react';
import NextApp from 'next/app';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import { theme } from '@chakra-ui/core';

const customIcons = {
  logo: {
    path: (
      <path
        fill="currentColor"
        d="m18.1085 11.8202c.0037.0002.0074.0004.011.0007-.1053-.2009-.1594-.4305-.1483-.6718.0257-.5592.3981-1.0234.9012-1.19773-.1821-.1091-.3815-.21456-.5824-.32084-.3149-.16654-.6336-.33511-.8957-.52287-1.0193-.73438-1.5936-1.90765-1.5936-1.90765s-.397.67739-.2638 1.27699c.0334.15151.1519.34473.2477.50106.0622.10142.1148.18732.1286.23625.0556.19672-1.0426-.5505-1.0426-.5505s-.1277.80901.2335 1.19033c.2048.21596.4693.33566.6459.41566.1196.0542.1989.0901.1921.1253-.0292.1524-1.3121-.1162-1.3084-.1161.0074.0148.2571.3938.4567.6266l-.0905.0173-3.3191.795c-.7512.1799-1.2809.8515-1.2809 1.6239v.8843.6049 1.6123.4141 2.0263 2.0264.0452.7948 1.1863 2.0264 1.0781c0 .6022.3225 1.1584.8452 1.4575l3.7548 2.1486c.683.3908 1.5334-.1023 1.5334-.8892v-.1938-.3787-3.2225-.2262-1.8002-2.0263h2.0444 2.0445 2.0444v2.0263 1.3283c0 .7197.7239 1.214 1.3942.9521.3921-.1532.6503-.5311.6503-.9521v-1.3283-2.0263-2.0264-.4515-1.5748-2.0264-.4052c0-.6607.6173-1.1479 1.2599-.9942.46.11.7845.5212.7845.9942v.4052 2.0264 2.0263 2.0264 2.0263 2.0264c0 .5457-.2922 1.0496-.7658 1.3206l-5.8954 3.3738c-.3062.1753-.6825.1752-.9887-.0002-.6634-.3798-1.4896.0991-1.4896.8635v.0349c0 .3641.195.7003.5111.8812l.4875.2789c.6105.3493 1.3602.3493 1.9706 0l3.6147-2.0685 3.7548-2.1486c.5227-.2991.8452-.8553.8452-1.4575v-1.0781-2.0264-1.1863-.7948-.0452-2.0264-2.0263-.4141-1.6123-.6049-.8843c0-.7724-.5297-1.444-1.2809-1.6239l-3.3191-.795-.1806-.0432c-.6898-.165-1.3527.3579-1.3527 1.0672v.6935 2.1906 1.0132 1.0132 1.5748.4515h-2.0444-2.0445-2.0444v-2.0263-1.192c0-.6469-.5933-1.1311-1.2271-1.0015-.4757.0973-.8174.5159-.8174 1.0015v1.192 2.0263 2.0264 2.0263 2.0264.2895c0 .7851-.8483 1.2771-1.5298.8873-.3183-.1821-.5146-.5207-.5146-.8873v-.2895-2.0264-1.9811-.0452-2.0264-2.0263-.4141-1.6123c0-.7211.4682-1.3587 1.1563-1.5745l4.5283-1.42zm.9942.3195c.5162.0237.9541-.372.978-.8837.024-.5118-.3752-.9459-.8914-.9696-.5163-.0237-.9542.3719-.9781.8837s.3752.9459.8915.9696z"
      />
    ),
    viewBox: '0 0 230 40',
  },
};

const customTheme = {
  ...theme,
  fonts: {
    body: 'Nunito, system-ui, sans-serif',
  },
  icons: {
    ...theme.icons,
    ...customIcons,
  },
  colors: {
    ...theme.colors,

    gray: {
      ...theme.colors.gray,
      100: '#FAFAFB',
    },
    brand: {
      50: '#ffe2fc',
      100: '#ffb1e8',
      200: '#ff7fd7',
      300: '#ff4cc6',
      400: '#ff1ab5',
      500: '#e6009c',
      600: '#b40079',
      700: '#810058',
      800: '#500035',
      900: '#1f0014',
    },
  },
};

class App extends NextApp {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={customTheme}>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}

export default App;
```

First we imported the necessary npm modules, then we created a theme object for our styles. Finally, we pass the theme to `ThemeProvider` which is used to wrap our web pages. Note that we also imported `CSSReset` from Chakra to reset the default the styles.

Restart the app again and take another look:

![](https://paper-attachments.dropbox.com/s_AA9C598A3927718DF41EFCCB3BCF89597B4CC6A74B2279E11E482C3DF767D3C9_1578917420822_image.png)

No more surprises!

Try updating the text color in `index.js` page to see the wonders of theming:

```javascript
function Index() {
  return (
    <Text fontSize="40px" color="brand.500" as="h1">
      Hello, Herm!
    </Text>
  );
}
```

`color` now points to the 500 brand color we defined in the theme and we also removed font family since it has been defined in the them object as well.