---
title: "0.3 Mentality"
metaTitle: "Mentality"
metaDescription: "When you have a strong opinion, do you ever stop to reflect on what it would have felt like if the present you is forcing an opinion on a younger you?"
---

We have strong opinions about a lot of things in life, especially when it comes to work/career stuff — the best tool, the best pattern, the best shortcuts, and so on. What we forget, though, is that there was a time we were all at our absolute zero. At that time, we knew nothing about what we know now. 

> When you have a strong opinion, do you ever stop to reflect on what it would have felt like if the present you is forcing an opinion on a younger you?

When you have a strong opinion, do you ever stop to reflect on what it would have felt like if the present you is forcing an opinion on a younger you? From my experience in learning and teaching, as well as watching other teachers teach, I have learned that:


1. It is harder for beginners to learn in the same room with professionals. The same thing goes when content is prepared with both levels in mind.
2. Professionals are impatient when contents are beginner-friendly.
3. Professionals end up learning a lot of fundamental concepts they thought they knew if they stick around.

I understand that it’s either:

1. You are here to learn every single thing I am going to teach.
2. You are here for just one page to close your skill gap as a professional.

This is why I decided to find a balance for both parties and make sure you get as much skills as you can from this workshop. To achieve this, here are some principles that will guide us:


## 1. Language Readability Over Terseness

It is very tempting to write concise code. It feeds what makes us powerful as professional developers. Unfortunately, knowing how to write shorter lines of code does not necessarily make you an expert.

```js
a == b 
 ? true
 : a == c ? true
 : false
```

Not everyone will know that this code is checking if `a` is equal to `b` and if it is not, checks if `a` is equal to `c`.

`if` statements are the first things we learn about conditions in programming languages. It is better to stick with such fundamentals so we can leave the door wide enough for everyone to get in.


## 2. Use Modern Tools

It is very easy to contradict the readability principle with this one. Let’s start with an example:

```js
function Component() {
  const [counter, setCounter] = React.useState(0)
  if(counter > 10) {
    // do stuff
  }
  // do other stuff
}
```

vs

```js
const Component = () => {
  const [counter, setCounter] = React.useState(0)
  
  counter > 10 
    ? // do stuff
    : // do other stuff
}
```

In the first example, we are writing readable JS and modern React, while in the second, we are writing terse JS and modern React. As a rule of thumb, stick with fundamental for the core language and modern for the tool.


## 3. Show then Explain

A lot of times, I might drop a few lines of code before explaining what is going on. It makes us less laid back about learning because it allows your brain to figure out what is going on first. After which you get an explanation to compare your thoughts with.


## 4. Fail Intentionally, then Fix

Sometimes I will intentionally run changes we made even when I know it is not going to work. It is good practice to familiarize yourself with errors you will expect in real-world situations. After we have failed, I will explain why it failed, and then we can fix it.


## 5. Buy Before Building

It is prevalent that a common problem has been solved in programming. Don’t reinvent. Buy does not mean spending money; it means to use what already exists. If it’s not open source but has a free plan or you can afford it, go for it. Trust me; your time is always more important than the money in the bank.

