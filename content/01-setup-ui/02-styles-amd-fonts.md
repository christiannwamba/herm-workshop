---
title: "1.2 Styles and Fonts"
metaTitle: "Styles and Fonts"
metaDescription: "Setup styled-components for a Next.js App -- setup fonts -- add reset.css"
---

Next.js has a bundled styling framework, [styled-jsx](https://github.com/zeit/styled-jsx). `styled-jsx` would work fine but for the sake of popularity and familiarity, I decided to go with [styled-components](http://styled-components.com/).

Styled components have two major syntaxes that you should care about:

```js
import styled from 'styled-components'

// 1. Styling primities
const Box = styled.div`
  height: 50px
` // Box becomes a React component

// 2. Styling components
const Card = styled(Box)`
  border-radius: 8px
` // Card becomes a React Component as well
```


## Objectives


- Setup styled-components for a Next.js App
- Configure SSR for styles
- Add a Google font
- Add a CSS reset


## Exercise 1: Setup Styled Components

Install `styled-components` via npm:

```bash
npm install --save styled-components
```


Replace the content of `pages/index.js` with:

```js
import React from 'react'
import styled from 'styled-components'

const Title = styled.h1`
  font-size: 40px;
  color: rebeccapurple;
`

export default () => <Title>Hello, Herm</Title>
```

Instead of just h1, we are returning a *styled h1* named `Title`. Reload the page at `3000` and you should see no difference in styling:


![](https://paper-attachments.dropbox.com/s_AA9C598A3927718DF41EFCCB3BCF89597B4CC6A74B2279E11E482C3DF767D3C9_1578913080586_image.png)


Now the mind-bugging thing that throws beginners off is that when you update the code, and hot-reload happens, the style gets applied:


![](https://paper-attachments.dropbox.com/s_AA9C598A3927718DF41EFCCB3BCF89597B4CC6A74B2279E11E482C3DF767D3C9_1578913168473_image.png)


Here's what is happening. When you do a reload, you are going to the server and asking it for what it’s got. Next.js, which has a server running, will give you the page, but what it does not do is also to inject the styles you added with styled-components.

Why does it work when you update the code, though? Hot module replacement happens, and as the name says, it’s a *replacement* not a *reload*. What this implies is that during replacement, React will run only on the client-side, and whatever client code available will pass too. Therefore, React knows about your client styles, but Next.js does not. We need to tell Next.js.


## Exercise 2: Configure SSR for styles

Next.js has special files that can live in the `pages` folder but are not actual pages. Instead, they wrap pages before Next.js serves those pages from the server:


1. `_document.js`  is used to define your own custom HTML and body tags. It is useful for injecting styles and fonts to your *actual* pages.
2. `_app.js`: Is used to initialize pages. It is useful when you want to do things like maintaining states between two pages, global error handling, retaining layouts across pages, etc.

Since we want to inject styles to the pages on the server, what we need right now is a `pages/_document.js`. Create one and add the following:

```js
import Document from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }
}
```

You also need to tell babel that styled-component wants to be used in SSR mode by updating the `.babelrc` code with the following:

```json
{
  "presets": ["next/babel"],
  "plugins": [["graphql-tag"], ["styled-components", { "ssr": true }]]
}
```

You will still not notice any difference when you reload, but once you kill the running app process (CTRL + C) and run `npm run dev` again, things will start working as expected.


## Exercise 3: Add a Google font

We mentioned that `_document.js` is also a great place for placing global styles, let’s take advantage of that to add a global font file:

```js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // CSS SSR...
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

We now have a `render` function like every other React component, but this time we took the liberty to wrap our page content `<Main />` and page scripts `<NextScript />` with a HTML and body tag. This way, we can inject the global styles and fonts to the `head` of the page.

Set the font-family in the style we already have in `pages/index.js` to see some changes:

```js
const Title = styled.h1`
  font-size: 40px;
  color: rebeccapurple;
  font-family: 'Nunito', sans-serif;
```

Here you go:

![](https://paper-attachments.dropbox.com/s_AA9C598A3927718DF41EFCCB3BCF89597B4CC6A74B2279E11E482C3DF767D3C9_1578915480006_image.png)

## Exercise 4: Add a CSS reset

We have some styling defaults that we don’t need — things like margins around our headings or padding in the body. We want to take full control of everything by resetting everything to 0 or its equivalent.

[styled-reset](https://github.com/zacanger/styled-reset) is a library that works together with styled-components to reset your CSS based on [Meyer’s reset code](https://www.google.com/search?client=safari&rls=en&q=css+reset&ie=UTF-8&oe=UTF-8).

To use it, install the `styled-reset` library:

```bash
npm install --save styled-reset
```

Import it in `pages/_document.js` and render it’s component in the `getInitialProps` function:

```js
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

// Import styled-reset
+ import { Reset } from 'styled-reset';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
+           <Reset />
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    //...    
  }
}
```

Restart the app again and take another look:


![](https://paper-attachments.dropbox.com/s_AA9C598A3927718DF41EFCCB3BCF89597B4CC6A74B2279E11E482C3DF767D3C9_1578917420822_image.png)


No more surprises!


