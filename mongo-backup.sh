#!/bin/bash

# Set the backup directory path
BACKUP_DIR="./"

# Create a timestamped backup directory
BACKUP_TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_PATH="$BACKUP_DIR/$BACKUP_TIMESTAMP"
mkdir -p "$BACKUP_PATH"

# Install MongoDB command-line utilities (if not already installed)
if ! command -v mongodump &> /dev/null; then
  echo "MongoDB command-line utilities not found. Please install MongoDB first."
  exit 1
fi

# Create a backup of a specific MongoDB database
mongodump --db test -o "$BACKUP_PATH/db"

echo "Backup created at: $BACKUP_PATH"