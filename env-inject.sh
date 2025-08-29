#!/bin/sh
# Inject all environment variables into Next.js runtime config
# This way, we don't need to rebuild the Docker image when env changes

RUNTIME_ENV_FILE="./public/runtime-config.js"
echo "window.RUNTIME_CONFIG = {" > $RUNTIME_ENV_FILE

# Loop through all env vars starting with NEXT_PUBLIC_
for var in $(env | grep NEXT_PUBLIC_); do
  key=$(echo $var | cut -d= -f1)
  value=$(echo $var | cut -d= -f2-)
  echo "  \"$key\": \"$value\"," >> $RUNTIME_ENV_FILE
done

echo "};" >> $RUNTIME_ENV_FILE
echo "Runtime environment variables injected."