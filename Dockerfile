FROM denoland/deno:latest

USER deno
WORKDIR /app
COPY --chown=deno:deno . /app/

CMD ["run", "--allow-all", "main.ts"]