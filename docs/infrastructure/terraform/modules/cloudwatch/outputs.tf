output "dashboard_name" {

  value = aws_cloudwatch_dashboard.dashboard.dashboard_name

}

output "log_group_name" {

  value = aws_cloudwatch_log_group.lambda_logs.name

}