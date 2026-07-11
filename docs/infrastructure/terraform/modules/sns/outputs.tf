output "career_events_topic_arn" {
  value = aws_sns_topic.career_events.arn
}

output "resume_uploaded_topic_arn" {
  value = aws_sns_topic.resume_uploaded.arn
}

output "job_applied_topic_arn" {
  value = aws_sns_topic.job_applied.arn
}

output "notifications_topic_arn" {
  value = aws_sns_topic.notifications.arn
}