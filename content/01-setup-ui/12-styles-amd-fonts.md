---
title: "1.2 Styles and Fonts"
metaTitle: "Styles and Fonts"
metaDescription: "Setup styled-components for a Next.js App -- setup fonts -- add reset.css"
---

Next.js has a bundled styling framework, [styled-jsx](https://github.com/zeit/styled-jsx). `styled-jsx` would work fine but for the sake of simplicity, I decided to go with [Chakra UI](https://chakra-ui.com).

Chakra UI is a modular and accessible component library that gives you all the building blocks you need to build React applications.

If you wanted to create a flex box with some alignment, it will be as straightforward as the following

```js
// Import Flex from Chakra
import { Flex } from "@chakra-ui/core";

// Create a Flex
<Flex alignItems="center" justifyContent="center">
  
</Flex>;
```

My favorite Chakra feature is the ability to define responsive styles with array:

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
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
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

Chakra also give you a smooth API to define themes as a global object. With themes you don't have to always remember how to spell your font name or what your primary color is.

We can define both themes and CSS reset in the `pages/_app.js` file.

To do so, create `pages/_app.js` with the following:

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
        d="..." // Full path here: 
      />
    ),
    viewBox: '0 0 230 40',
  },
};

const customTheme = {
  ...theme,
  fonts: {
    body: "Nunito, system-ui, sans-serif",
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
    const { Component } = this.props;
    return (
      <ThemeProvider theme={customTheme}>
        <CSSReset />
        <Component />
      </ThemeProvider>
    );
  }
}

export default App;

```

First we imported the necessary npm modules, then we created a theme object for our styles. Finally, we pass the theme to `ThemeProvider` which is used to wrap our web pages. Not that we also imported `CSSReset` from Chakra to reset the default the styles.

Restart the app again and take another look:

![](https://paper-attachments.dropbox.com/s_AA9C598A3927718DF41EFCCB3BCF89597B4CC6A74B2279E11E482C3DF767D3C9_1578917420822_image.png)

No more surprises!

Try updating your styles `index.js` page to see the wonders of theming:

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