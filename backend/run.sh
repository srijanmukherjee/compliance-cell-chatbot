#!/bin/sh

# load environment variables from .env.local file
set -a
source ./.env.local
set +a

export GOOGLE_APPLICATION_CREDENTIALS="credentials.json"
uvicorn app.main:app --reload
