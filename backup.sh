#!/bin/bash

# SafeTech Database Backup Script
# Backs up MongoDB database for SafeTech

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/safetech_backup_$TIMESTAMP"

# Create backups directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "📦 Starting MongoDB backup..."
echo "Backup file: $BACKUP_FILE"

# Run mongodump
mongodump --uri="${MONGODB_URI:-mongodb://localhost:27017/safetech}" --out=$BACKUP_FILE

if [ $? -eq 0 ]; then
  echo "✅ Backup completed successfully!"
  echo "Location: $BACKUP_FILE"
  
  # Optional: Compress the backup
  tar -czf "$BACKUP_FILE.tar.gz" -C $BACKUP_DIR $(basename $BACKUP_FILE)
  rm -rf $BACKUP_FILE
  echo "✅ Backup compressed: $BACKUP_FILE.tar.gz"
else
  echo "❌ Backup failed!"
  exit 1
fi

# Keep only last 7 backups
echo "🧹 Cleaning up old backups (keeping last 7)..."
ls -t $BACKUP_DIR/*.tar.gz | tail -n +8 | xargs rm -f

echo "✨ Done!"
