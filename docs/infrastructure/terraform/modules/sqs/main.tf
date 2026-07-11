###################################################
# Resume Queue
###################################################

resource "aws_sqs_queue" "resume_queue" {

  name = "${var.project_name}-${var.environment}-resume"

  visibility_timeout_seconds = 60

  message_retention_seconds = 345600
}

###################################################
# Job Queue
###################################################

resource "aws_sqs_queue" "job_queue" {

  name = "${var.project_name}-${var.environment}-jobs"

  visibility_timeout_seconds = 60

  message_retention_seconds = 345600
}

###################################################
# Notification Queue
###################################################

resource "aws_sqs_queue" "notification_queue" {

  name = "${var.project_name}-${var.environment}-notifications"

  visibility_timeout_seconds = 60

  message_retention_seconds = 345600
}