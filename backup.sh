#!/bin/bash

# Database Backup Script for BioCompute Admin Portal
# Schedule this script with cron for automated backups

set -e

# Configuration
BACKUP_DIR="./backups"
CONTAINER_NAME="biocompute_postgres"
DB_USER="myuser"
DB_NAME="jobportal"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"
DAYS_TO_KEEP=7

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "🔄 Starting database backup..."
echo "📅 Timestamp: $TIMESTAMP"

# Perform backup
docker exec $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE
BACKUP_FILE="${BACKUP_FILE}.gz"

echo "✅ Backup completed: $BACKUP_FILE"

# Get backup size
BACKUP_SIZE=$(du -h $BACKUP_FILE | cut -f1)
echo "📦 Backup size: $BACKUP_SIZE"

# Delete old backups
echo "🗑️  Cleaning up old backups (keeping last $DAYS_TO_KEEP days)..."
find $BACKUP_DIR -name "backup_*.sql.gz" -type f -mtime +$DAYS_TO_KEEP -delete

# List recent backups
echo ""
echo "📋 Recent backups:"
ls -lh $BACKUP_DIR/backup_*.sql.gz | tail -5

echo ""
echo "✅ Backup process completed successfully!"

# Optional: Upload to cloud storage (uncomment and configure)
# aws s3 cp $BACKUP_FILE s3://your-bucket/backups/
# gsutil cp $BACKUP_FILE gs://your-bucket/backups/
