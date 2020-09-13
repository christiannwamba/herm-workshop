---
title: "6.2 Setup the UI for creating and listing posts"
metaTitle: "Setup a new table for scheduled posts with migrations"
---

We have the table set up, now we'll flesh out the UI for creating posts. The UI will users create new posts and also see a list of previously created posts.

## Objectives

- List all pending scheduled posts
- Create a post form component


## Exercise 1: Fetch Scheduled Posts

**Task 1: Fetch scheduled posts**

Now we can create posts, the next step is to fetch and display all posts by the logged in user. Open the `/pages/index.js` file, it should look like this

```js
```

Update it and add the following query before the return value of the component:

```js
const USER_QUERY = gql`
  {
    user {
      id
      username
      scheduled_posts(order_by: { created_at: desc }) {
        id
        is_pending
        schedule_for
        text
        user_id
      }
    }
  }
`;
```

The query should return details about the logged in user. If you run the query above in the Hasura explorer, the response should be similar to this:

```js
{
  "data": {
    "user": [
      {
        "id": 1,
        "username": "John",
        "scheduled_posts": []
      }
    ]
  }
}
```

The `scheduled_posts` array is empty because we're yet to create any posts. To run the query above within the component, use the `useQuery` apollo hook. Add the following imports to the top of the file:

```js
import { Box, Text, CircularProgress, Flex } from "@chakra-ui/core";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import PostCard from "../components/PostCard";
```

Then, add the following lines below the query:

```js
const USER_QUERY = gql`
  ...
`;

const { data, loading, refetch } = useQuery(USER_QUERY);
const [user] = data && data.user ? data.user : [{}];
```

**Task 2: Show a list of posts**

We have the query to fetch the scheduled posts, next, update the return value of the page to render the posts and the form. Your return value should look like this:

```js
return (
  <Layout me={me}>
    <Box width="70%">
      <Box marginBottom="40px" width="100%">
        <Text
          fontSize="18px"
          color="#1D1D1D"
          fontWeight="bold"
          lineHeight="25px"
        >
          Scheduled Posts
        </Text>
        {loading ? (
          <Flex justifyContent="center" padding="50px 0">
            <CircularProgress isIndeterminate color="pink"></CircularProgress>
          </Flex>
        ) : (
          <Box marginTop="19px">
            {user.scheduled_posts.map((post) => (
              <PostCard me={me} post={post} key={post.id} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  </Layout>
);
```

**Task 3: Create post component**

You must have noticed by now that there's an error preventing the app from compiling. The `PostCard` component is nowhere to be found, let's fix that. Create a new file `PostCard.js` in the `/components` folder and add the following content:

```js
import React from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/core";
import { FaTrash, FaShare } from "react-icons/fa";
import { formatDate } from "lib";

const ButtonSubText = ({ children }) => (
  <Text marginLeft="10px" color="#364067" letterSpacing="0.1px" fontSize="14px">
    {children}
  </Text>
);

const PostCard = ({ me, post }) => {
  return (
    <Box
      width="100%"
      paddingTop="20px"
      paddingBottom="20px"
      paddingLeft="20px"
      paddingRight="20px"
      borderColor="#E2E2EA"
      borderWidth="0.5px"
      borderRadius="10px"
      borderStyle="solid"
      marginBottom="15px"
    >
      <Flex>
        <Box marginRight="5px">
          <img
            style={{ width: "90%", display: "block", borderRadius: "50%" }}
            src={me.picture}
            alt={me.name}
          />{" "}
        </Box>
        <Box>
          <Text fontWeight="bold" fontSize="15px" marginBottom="4px">
            {me.name}
          </Text>
          <Text fontSize="13px" color="#364067">
            Scheduled for {formatDate(post.schedule_for)}
          </Text>
        </Box>
      </Flex>

      <Box marginTop="20px">
        <Text fontSize="16px" color="#858ba2">
          {post.text}
        </Text>
      </Box>

      <Flex justifyContent="flex-end" width="100%" marginTop="10px">
        <Box marginRight="20px">
          <Button>
            <Flex alignItems="center" justifyContent="space-between">
              <FaShare size="22px" color="#92929D" />
              <ButtonSubText>Share Post</ButtonSubText>
            </Flex>
          </Button>
        </Box>

        <Button>
          <Flex alignItems="center" justifyContent="space-between">
            <FaTrash size="22px" color="#92929D" />
            <ButtonSubText>Delete</ButtonSubText>
          </Flex>
        </Button>
      </Flex>
    </Box>
  );
};

export default PostCard;
```

No posts have been created yet, head over to the Hasura explorer and paste the following query to create a new post.

```js
mutation {
  insert_scheduled_post(objects: {text: "Creating a new post", schedule_for: "0220-09-10T14:39:27.046Z", user_id: 1}) {
    affected_rows
  }
}
```

If the post creation was successful, you should get the following response:

```js
{
  "data": {
    "insert_scheduled_post": {
      "affected_rows": 1
    }
  }
}
```

Head to your browser, you should have an updated view, it should look like this:

> New view screenshot

It's not ideal to be heading to explorer whenever there's a need to create a post, so let's add a form that will let users create new posts.

## Exercise 2: Create a post form component

**Task 1: Create form component**

The post form component will allow a user schedule a post for a future date. In the `components/` folder, create a file `SchedulePostForm.js` and add the following content to it:

```js
import React, { useState } from "react";
import { Box, Text, Flex, Textarea, Button } from "@chakra-ui/core";
import { FaCalendar } from "react-icons/fa";

import CalendarModal from "./CalendarModal";
import { getCurrentTime } from "lib";

const ScheduleTweetForm = ({ me, user, refetch }) => {
  const { minutes, hours } = getCurrentTime();
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState({ minutes, hours });
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {};
  const submit = () => {};

  return (
    <Box border="0.5px solid #E2E2EA" borderRadius="10px" padding="10px 20px">
      <Box
        borderBottom="0.5px solid #E2E2EA"
        paddingBottom="10px"
        marginBottom="11px"
      >
        <Text
          fontSize="15px"
          color="#1D1D1D"
          letterSpacing="0.1px"
          fontWeight="bold"
        >
          Schedule Tweet
        </Text>
      </Box>

      <Box padding="10px 0" position="relative">
        <form onSubmit={submit}>
          <Flex justifyContent="space-between">
            <Box width="5%">
              <img
                style={{ width: "90%", display: "block", borderRadius: "50%" }}
                src={me.picture}
                alt={me.name}
              />
            </Box>

            <Textarea
              width="89.7%"
              type="text"
              value={text}
              border="none"
              placeholder="What would you like schedule?"
              onChange={(e) => setText(e.target.value)}
            />
            {showCalendar && (
              <CalendarModal
                date={date}
                time={time}
                setTime={setTime}
                setDate={setDate}
                close={setShowCalendar}
              />
            )}
            <Box width="5%" alignSelf="flex-end">
              <Button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <FaCalendar size="23px" color="#92929D" />
              </Button>
            </Box>
          </Flex>
          <Flex marginTop="16px" marginLeft="5%">
            <Button
              isLoading={loading}
              loadingText="Submitting"
              type="submit"
              variantColor="pink"
            >
              Submit
            </Button>
          </Flex>
        </form>
      </Box>
    </Box>
  );
};

export default ScheduleTweetForm;
```

When you copy the content above into your file, you'll notice some missing values and imports. Don''t worry about those, we'll slowly clear them.

**Task 2: Create the calendar component**

This component will capture the date and time selection of the user, for this, we will make use of an external [Calendar component](https://github.com/hernansartorio/react-nice-dates) and a [Date utility library](https://date-fns.org/). Run the command below to install the packages

```bash
npm install react-nice-dates date-fns --save
```

After installing the packages, create a new file `CalendarModal.js` in the `/components` folder and add the content below to it:

```js
import React from "react";
import { enGB } from "date-fns/locale";
import { DatePickerCalendar } from "react-nice-dates";
import { Flex, Select, Box, Button } from "@chakra-ui/core";

import { generateValues } from "lib";

const CalendarModal = ({ date, setDate, time, setTime, close }) => {
  const minutes = generateValues(60);
  const hours = generateValues(24);

  return (
    <Box
      position="absolute"
      background="white"
      zIndex="1"
      top="80%"
      right="-2%"
      padding="15px"
      boxShadow=" 0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      minWidth="400px"
      borderRadius="4px"
    >
      <Box marginBottom="15px">
        <DatePickerCalendar date={date} onDateChange={setDate} locale={enGB} />
      </Box>

      <Flex margin="13px 0" justifyContent="space-between">
        <Select
          placeholder="Select hour"
          width="49%"
          value={time.hours}
          onChange={(e) => setTime({ ...time, hours: e.target.value })}
        >
          {hours.map((hour) => (
            <option value={hour}>{hour}</option>
          ))}
        </Select>
        <Select
          placeholder="Select Minute"
          width="49%"
          value={time.minutes}
          onChange={(e) => setTime({ ...time, minutes: e.target.value })}
        >
          {minutes.map((minute) => (
            <option value={minute}>{minute}</option>
          ))}
        </Select>
      </Flex>

      <Flex justify="flex-end">
        <Button variantColor="pink" onClick={() => close(false)}>
          Done
        </Button>
      </Flex>
    </Box>
  );
};

export default CalendarModal;
```

We referenced a helper function to generate hour and minute values for the select input. Create a new file `index.js` in the `/lib` folder and add the content below to it:

```js
import { formatRelative } from "date-fns";

export const generateValues = (start) =>
  Array.from(Array(start).keys()).map((val) => (val < 10 ? `0${val}` : val));

export const getCurrentTime = () => {
  const time = new Date();
  const minutes =
    time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
  const hours = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();

  return { minutes, hours };
};

export const formatDate = (date) => {
  const today = new Date();
  const scheduleDate = new Date(date);
  return formatRelative(scheduleDate, today);
};
```

The functions above will be used while we work with dates. The `getCurrentTime` function returns the current time in minutes and hours, while the `formatDate` function parses the a given date relative to the current date.

**Task 3: Handle form submit**

Back to the form now, we need to handle the form submission. When the user enters a piece of text and selects a date and time, the component should run a mutation and create a scheduled post for the user. In the `SchedulePostForm.js` update the body of the `reset` and `submit` functions to look like the snippet below:

```js
const reset = () => {
  setText("");
  setDate(new Date());
  setTime({ minutes, hours });
  setLoading(false);
};

const submit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const scheduleTime = new Date(
    new Date(date).setHours(time.hours, time.minutes, 0)
  );
  const data = {
    text,
    schedule_for: scheduleTime,
    user_id: user.id,
  };

  const result = await fetch(`${process.env.BASE_URL}/api/createPost`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  refetch();
  reset();
};
```

The `reset` function basically returns the component to it's initial state while the `submit` function calls `/api/createPost` route with the data entered by the user.

WWe're yet to create the route and you're probably wondering why we call the API route rather than running a mutation directly using the `useMutation` Apollo hook. Asides from creating the post, the execution of the post needs to be schedule and we can move a complex task like this away from the component.

Update the `pages/index.js` file to render the form:

```yml
...
+ import ScheduleTweetForm from '../components/SchedulePostForm';


function Index({ me }) {
  const USER_QUERY = gql`
    ...
  `
  ...

  return (
    <Layout me={me}>
      <Box width='70%'>
+       <Box marginBottom='40px' width='100%'>
+         <ScheduleTweetForm me={me} user={user} refetch={refetch} />
+       </Box>
        <Box marginBottom='40px' width='100%'>
          ...
        </Box>
      </Box>
    </Layout>
  );
...
}
```

Head to the browser to see the changes. You should see a view similar to this:

> Screenshot with schedule form

Submitting the form fails and in the next section, we will create a new route for creating posts and then create a 'One-Off Event' in Hasura to execute on the given date
