# How to Host Your Portfolio

Since this is a **Vite + Three.js** project, the best hosting platforms are **Netlify** or **Vercel**. They are free, fast, and require almost no configuration.

I have already built your project. The production-ready files are in the `dist` folder:
`c:\Users\PRASHANT\Desktop\portfolio\dist`

---

## Option 1: Netlify (Easiest - Drag & Drop)
**Recommended for getting it online in 30 seconds.**

1.  Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2.  Open your file explorer to `c:\Users\PRASHANT\Desktop\portfolio`.
3.  Drag the **`dist`** folder (not the whole project, just the `dist` folder) and drop it onto the Netlify page.
4.  **Done!** Netlify will generate a link for you instantly. You can then change the site name in "Site Settings".

## Option 2: Vercel (Professional)
**Best if you put your code on GitHub later.**

1.  Go to [vercel.com](https://vercel.com) and sign up.
2.  Install the Vercel CLI in your terminal:
    ```bash
    npm install -g vercel
    ```
3.  Run the deploy command inside your project folder:
    ```bash
    vercel
    ```
4.  Follow the prompts (Log in, `Y` for existing project, enter to accept defaults).

## Option 3: GitHub Pages (Free, requires config)
If you prefer GitHub Pages:
1.  You must edit `vite.config.js` and add `base: '/repo-name/'`.
2.  Push code to GitHub.
3.  Enable Pages in Settings.
*(Note: Netlify/Vercel are recommended over this because you don't need to change any config)*
