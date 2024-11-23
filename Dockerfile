FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY projects /app
COPY pnpm-lock.yaml /app
COPY package.json /app
RUN echo $(ls -1 /app)
WORKDIR /app

FROM base AS build
RUN echo $(ls -1 .)

COPY .  /usr/src/app
WORKDIR /usr/src/app
RUN echo $(ls -1 /usr/src/app)

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
