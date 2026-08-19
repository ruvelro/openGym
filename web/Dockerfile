# Multi-stage: build the React app, then serve it with nginx.
# Self-hosters never need Node locally — `docker compose up` builds everything.
#
# --platform=$BUILDPLATFORM pins the build stage to the host's native arch even when
# cross-building for other targets (e.g. amd64 host building an arm64 image). The build
# output (static JS/CSS/HTML) is arch-independent, so there's no reason to run it under
# QEMU — and QEMU-emulated npm installs are known to corrupt esbuild/rollup's platform-
# specific native binaries, which is what breaks `vite build` with unrelated-looking
# module-resolution errors.
FROM --platform=$BUILDPLATFORM node:22-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci 2>/dev/null || npm install
COPY frontend/ ./

# Where the app fetches exercise images and animations from. Empty is the default and
# means "my own origin" — which is what compose serves, mounting media/ into nginx below.
# A deployment with no such volume (Render, any single-container host) passes the CDN
# bases instead, so the app works without shipping ~140 MB into the image.
ARG VITE_IMG_BASE=
ARG VITE_GIF_BASE=
RUN npm run build

FROM nginx:alpine
COPY web/nginx.conf.template /etc/nginx/templates/default.conf.template
# Where the API lives, as host:port. Overridden by deployments that don't use compose's
# service names. The filter keeps envsubst away from nginx's own $-variables.
ENV API_UPSTREAM=api:3000 \
    NGINX_ENVSUBST_FILTER=^API_
COPY --from=build /app/dist /usr/share/nginx/html
# exercise media (img/gif) is mounted at runtime from the media volume, unless the
# build was pointed at a CDN with VITE_IMG_BASE / VITE_GIF_BASE
