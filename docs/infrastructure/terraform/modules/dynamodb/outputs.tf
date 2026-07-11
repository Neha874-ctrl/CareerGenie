output "users_table_name" {
  value = aws_dynamodb_table.users.name
}

output "jobs_table_name" {
  value = aws_dynamodb_table.jobs.name
}

output "applications_table_name" {
  value = aws_dynamodb_table.applications.name
}

output "notifications_table_name" {
  value = aws_dynamodb_table.notifications.name
}

output "feedback_table_name" {
  value = aws_dynamodb_table.feedback.name
}