resource "aws_dynamodb_table" "users" {

  name = "${var.project_name}-${var.environment}-users"

  billing_mode = "PAY_PER_REQUEST"

  hash_key = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-users"
  }

}
resource "aws_dynamodb_table" "jobs" {

  name = "${var.project_name}-${var.environment}-jobs"

  billing_mode = "PAY_PER_REQUEST"

  hash_key = "jobId"

  attribute {
    name = "jobId"
    type = "S"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-jobs"
  }

}
resource "aws_dynamodb_table" "applications" {

  name = "${var.project_name}-${var.environment}-applications"

  billing_mode = "PAY_PER_REQUEST"

  hash_key = "applicationId"

  attribute {
    name = "applicationId"
    type = "S"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-applications"
  }

}
resource "aws_dynamodb_table" "notifications" {

  name = "${var.project_name}-${var.environment}-notifications"

  billing_mode = "PAY_PER_REQUEST"

  hash_key = "notificationId"

  attribute {
    name = "notificationId"
    type = "S"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-notifications"
  }

}
resource "aws_dynamodb_table" "feedback" {

  name = "${var.project_name}-${var.environment}-feedback"

  billing_mode = "PAY_PER_REQUEST"

  hash_key = "feedbackId"

  attribute {
    name = "feedbackId"
    type = "S"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-feedback"
  }

}