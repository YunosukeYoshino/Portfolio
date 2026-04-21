---
name: about-portfolio
description: Retrieve information about Yunosuke Yoshino's portfolio — skills, projects, background, and how to reach him. Use this skill when an agent needs to learn who Yunosuke Yoshino is, what technologies he works with, what projects he has built, or any general information about this portfolio site.
---

# About Yunosuke Yoshino — Portfolio Information

Yunosuke Yoshino is a front-end developer based in Tokyo, Japan, specialising in e-commerce.

## Retrieve portfolio information (Markdown)

The homepage returns a complete Markdown document when you negotiate content type:

```
GET https://yunosukeyoshino.com/
Accept: text/markdown
```

The response includes About, Selected Works, Skills, Articles, and API discovery sections.
The response header `x-markdown-tokens` gives an approximate token count.

## Retrieve an individual article (Markdown)

```
GET https://yunosukeyoshino.com/article/{slug}
Accept: text/markdown
```

Returns the article in Markdown format when the article was authored in Markdown.
Falls back to HTML if the article is in rich-text format.

## Key facts

- **Name**: Yunosuke Yoshino
- **Location**: Tokyo, Japan
- **Specialisation**: Front-end development (e-commerce focus)
- **Core skills**: React, Next.js, TanStack Start, TypeScript, Tailwind CSS, WebGL, GSAP, Cloudflare Workers
- **Contact**: https://yunosukeyoshino.com/contact
- **Articles**: https://yunosukeyoshino.com/article/page/1
- **API catalog**: https://yunosukeyoshino.com/.well-known/api-catalog
