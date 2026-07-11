output "lambda_function_name" {
  description = "Lambda Function Name"
  value       = aws_lambda_function.backend.function_name
}

output "lambda_function_arn" {
  description = "Lambda Function ARN"
  value       = aws_lambda_function.backend.arn
}

output "lambda_invoke_arn" {
  description = "Lambda Invoke ARN"
  value       = aws_lambda_function.backend.invoke_arn
}