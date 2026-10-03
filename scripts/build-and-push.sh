#!/usr/bin/env bash
set -euo pipefail

# Configuration
IMAGE_NAME="r466670/freeflix"
TAG="${1:-latest}"

echo "==> Building and pushing multi-platform image for $IMAGE_NAME:$TAG"

# Ensure buildx builder with multi-arch support exists
BUILDER_NAME="pi-builder"
if ! docker buildx inspect "$BUILDER_NAME" > /dev/null 2>&1; then
  echo "==> Creating Docker Buildx multi-arch builder: $BUILDER_NAME"
  docker buildx create --name "$BUILDER_NAME" --use --bootstrap
else
  docker buildx use "$BUILDER_NAME"
fi

# Build for both amd64 and arm64 (Raspberry Pi) and push
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --build-arg NEXT_PUBLIC_JELLYFIN_URL="https://jellyfin.randikalakshan.site" \
  --build-arg NEXT_PUBLIC_JELLYFIN_TOKEN="edfd09be50474d41abe77de6bc62b52c" \
  -t "${IMAGE_NAME}:${TAG}" \
  -t "${IMAGE_NAME}:latest" \
  --push \
  .

echo "==> Successfully pushed ${IMAGE_NAME}:${TAG} and ${IMAGE_NAME}:latest to Docker Hub!"
