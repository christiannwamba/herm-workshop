---
title: "1.3 App Shell"
metaTitle: "App Shell"
metaDescription: "Anything that tends to remain the same on a dynamic shell can be considered as part of the app’s shell"
---

We have a project set up, and we are ready to start fleshing out the app UI. First, we need to start with the layout, which all the pages will share. This layout needs to be a component for it to be reusable across pages.


## Objectives

- Create a layout component
- Add a header and a sidebar


## Exercise 1: Create a layout component

Let’s create our first component.

Add a `components/Layout.js` file with the following content:

```js
import React from 'react';
import { Box, Flex } from '@chakra-ui/core';

import Header from './Header';
import Sidebar from './Sidebar';
import Main from './Main';

function Layout({ children }) {
  return (
    <Box>
      <Header></Header>
      <Flex>
        <Sidebar></Sidebar>
        <Main>{children}</Main>
      </Flex>
    </Box>
  );
}

export default Layout;
```

To see this layout in action, update your `pages/index.js` to make use of it:

```js
import React from 'react';
import { Text } from '@chakra-ui/core';

import Layout from '../components/Layout';

function Index() {
  return (
    <Layout>
      <Text fontSize="40px" color="brand.500" as="h1">
        Hello, Herm!
      </Text>
    </Layout>
  );
}

export default Index;
```

The app should blow up with error since some components being used are yet to be created.

## Exercise 2: Create app shell components

App shell components make up the layout. They include headers, sidebars, navigation, footers, etc. Anything that tends to remain the same on a dynamic app can be considered as part of the app’s shell.

Create a `Header` component by adding the following in a `components/Header.js` file:

```js
import React from 'react';

import { Box, Flex, Icon, Avatar, Text } from '@chakra-ui/core';

function Header() {
  return (
    <Box backgroundColor="#fafafb" paddingLeft="50px" paddingRight="50px">
      <Flex alignItems="center" justifyContent="space-between" height="50px">
        <Box bg="gray.200" rounded="full">
          <Icon
            name="logo"
            color="brand.500"
            width="40px"
            height="40px"
            viewBox="0 0 40 40"
          ></Icon>
        </Box>
        <User
          username="Christian Nwamba"
          // sub="Scheduled for 16th December at 09:30 AM"
        ></User>
      </Flex>
    </Box>
  );
}

function User({ avatar, sub, username }) {
  return (
    <Flex alignItems="center">
      <Box>
        <Avatar size="sm" name={username} src={avatar} />
      </Box>
      {username && (
        <Box marginLeft="12px">
          <Text fontWeight="bold">{username}</Text>
          {sub && <Text fontSize="12px">{sub}</Text>}
        </Box>
      )}
    </Flex>
  );
}

export default Header;
```

The `Header` component also renders a `User` component. The `User` component is a component that shows the user avatar and the user name when a user is logged in. For now we are just rendering static content.

Create a `Sidebar` component by adding the following in a `components/Sidebar.js` file:

```js
import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/core';
import { FaRegClock, FaRegListAlt, FaRegUser } from 'react-icons/fa';

function Sidebar() {
  return (
    <Box
      bg="#fafafb"
      height="100vh"
      width="270px"
      pt="40px"
      pl="30px"
      pr="30px"
    >
      <NavItem Icon={FaRegListAlt}>Feeds</NavItem>
      <NavItem Icon={FaRegClock}>Schedule</NavItem>
      <NavItem Icon={FaRegUser}>Account</NavItem>
    </Box>
  );
}

function NavItem({ Icon, href = '#', children }) {
  const [mouseOver, setMouseOver] = React.useState(false);

  return (
    <a display="block" href={href}>
      <Flex
        alignItems="center"
        height="45px"
        bg={mouseOver && 'rgba(224, 0, 152, 0.1)'}
        cursor={mouseOver ? 'pointer' : 'default'}
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
        rounded="md"
        pt="10px"
        pb="10px"
        pl="20px"
        pr="20px"
      >
        <Box marginRight="10px">
          <Icon fill={mouseOver ? '#E00098' : '#364067'}></Icon>
        </Box>
        <Text color={mouseOver ? '#E00098' : '#364067'}>{children}</Text>
      </Flex>
    </a>
  );
}

export default Sidebar;
```

The sidebar component also renders a list of navigation items.

Create a `Main` component by adding the following in a `components/Main.js` file:

```js
import React from 'react';
import { Box } from '@chakra-ui/core';

function Main({ children }) {
  return (
    <Box paddingLeft="40px" paddingTop="40px">
      {children}
    </Box>
  );
}

export default Main;
```

Once you save all these and take another look at your browser, you will see that we are making good progress:

![App shell](https://res.cloudinary.com/codebeast/image/upload/v1591523886/CleanShot_2020-06-07_at_13.57.51_2x.png)