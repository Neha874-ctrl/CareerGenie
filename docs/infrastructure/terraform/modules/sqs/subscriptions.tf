###################################################
# Resume Topic -> Resume Queue
###################################################

resource "aws_sns_topic_subscription" "resume_subscription" {

  topic_arn = var.resume_uploaded_topic_arn

  protocol = "sqs"

  endpoint = aws_sqs_queue.resume_queue.arn
}

###################################################
# Job Topic -> Job Queue
###################################################

resource "aws_sns_topic_subscription" "job_subscription" {

  topic_arn = var.job_applied_topic_arn

  protocol = "sqs"

  endpoint = aws_sqs_queue.job_queue.arn
}

###################################################
# Notification Topic -> Notification Queue
###################################################

resource "aws_sns_topic_subscription" "notification_subscription" {

  topic_arn = var.notifications_topic_arn

  protocol = "sqs"

  endpoint = aws_sqs_queue.notification_queue.arn
}