import {
  StartServer,
  transformStreamWithRouter,
} from '@tanstack/start/server'
import { getRouterManifest } from '@tanstack/start/router-manifest'
import type { RenderToReadableStreamOptions } from 'react-dom/server'
import { renderToReadableStream } from 'react-dom/server'
import { createRouter } from './router'

export async function render(opts: {
  request: Request
  responseHeaders: Headers
  clientManifest?: unknown
}) {
  const router = createRouter()

  const readable = await renderToReadableStream(
    <StartServer router={router} />,
    {
      signal: opts.request.signal,
      bootstrapModules: ['/app/client.tsx'],
    } as RenderToReadableStreamOptions,
  )

  const transforms = transformStreamWithRouter({
    router,
    manifest: getRouterManifest(),
  })

  const transformedStream = readable.pipeThrough(transforms)

  return new Response(transformedStream, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...Object.fromEntries(opts.responseHeaders),
    },
  })
}
