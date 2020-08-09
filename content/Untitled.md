**What problem does this feature solve?** 

I am using AspectRatioBox as a wrapper around my hero component, to override the image initial ratio, so I'm sure the image (and the hero content) has the right ratio depending on the screen width.

**What does the proposed API look like?** 

Being able to do `<AspectRatioBox ratio={{ base: 0.75, lg: 2.3 }} />`

**Describe alternatives you've considered** 

```js
<AspectRatioBox
      w="100%"
      sx={{
        '&::before': {
          paddingBottom: [
            `${(1 / 0.75) * 100}%`,
            `${(1 / 1) * 100}%`,
            `${(1 / 1.5) * 100}%`,
            `${(1 / 1.5) * 100}%`,
            `${(1 / 2.3) * 100}%`,
          ],
        },
      }}
    >
```

