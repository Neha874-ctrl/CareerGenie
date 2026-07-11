output "resume_queue_arn" {
  value = aws_sqs_queue.resume_queue.arn
}

output "job_queue_arn" {
  value = aws_sqs_queue.job_queue.arn
}

output "notification_queue_arn" {
  value = aws_sqs_queue.notification_queue.arn
}

output "resume_queue_url" {
  value = aws_sqs_queue.resume_queue.id
}

output "job_queue_url" {
  value = aws_sqs_queue.job_queue.id
}

output "notification_queue_url" {
  value = aws_sqs_queue.notification_queue.id
}