#!/bin/bash

# MEPS 系統部署腳本
# 部署到 AWS S3

BUCKET_NAME="meps-system"
REGION="ap-east-2"  # 台北區域
DOCS_DIR="./docs"

echo "開始部署 MEPS 系統..."

# 同步檔案到 S3
aws s3 sync $DOCS_DIR s3://$BUCKET_NAME --region $REGION --delete

# 設定網站配置
aws s3 website s3://$BUCKET_NAME --region $REGION \
  --index-document index.html \
  --error-document index.html

echo "部署完成！"
echo "網站 URL: http://$BUCKET_NAME.s3-website.ap-east-2.amazonaws.com"
