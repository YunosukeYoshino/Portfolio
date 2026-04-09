'use client'

import { type RefObject, useEffect } from 'react'

export function useArticlesSectionAnimation(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    let gsapContext: { revert: () => void } | undefined

    Promise.all([
      import('gsap').then((module) => module.default),
      import('gsap/ScrollTrigger').then((module) => module.default),
    ]).then(([gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger)

      const section = sectionRef.current
      if (!section) return

      gsapContext = gsap.context(() => {
        const heading = section.querySelector('.articles-heading')
        if (heading) {
          gsap.fromTo(
            heading,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: heading,
                start: 'top 85%',
              },
            }
          )
        }

        const articleItems = gsap.utils.toArray(
          section.querySelectorAll('.article-batch-item')
        ) as HTMLElement[]

        if (articleItems.length > 0) {
          gsap.set(articleItems, { opacity: 0, y: 40 })

          ScrollTrigger.batch(articleItems, {
            start: 'top 85%',
            onEnter: (batch) => {
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                stagger: 0.1,
                overwrite: true,
              })
            },
          })
        }

        const viewAllLink = section.querySelector('.articles-view-all')
        if (viewAllLink) {
          gsap.fromTo(
            viewAllLink,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: viewAllLink,
                start: 'top 85%',
              },
            }
          )
        }
      }, section)
    })

    return () => {
      gsapContext?.revert()
    }
  }, [sectionRef])
}
