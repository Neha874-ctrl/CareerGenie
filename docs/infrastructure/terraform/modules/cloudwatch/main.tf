resource "aws_cloudwatch_log_group" "lambda_logs" {

  name = "/aws/lambda/${var.lambda_function_name}"

  retention_in_days = 30

}
resource "aws_cloudwatch_dashboard" "dashboard" {

  dashboard_name = "${var.project_name}-${var.environment}-dashboard"

  dashboard_body = jsonencode({

    widgets = [

      {

        type = "metric"

        width = 12

        height = 6

        properties = {

          metrics = [

            [

              "AWS/Lambda",

              "Invocations",

              "FunctionName",

              var.lambda_function_name

            ]

          ]

          period = 300

          stat = "Sum"

          region = "ap-south-1"

          title = "Lambda Invocations"

        }

      }

    ]

  })

}

resource "aws_cloudwatch_metric_alarm" "lambda_errors" {

  alarm_name = "${var.project_name}-${var.environment}-lambda-errors"

  comparison_operator = "GreaterThanThreshold"

  evaluation_periods = 1

  metric_name = "Errors"

  namespace = "AWS/Lambda"

  period = 300

  statistic = "Sum"

  threshold = 1

  alarm_description = "Alarm when Lambda throws errors."

  dimensions = {

    FunctionName = var.lambda_function_name

  }

}

resource "aws_cloudwatch_metric_alarm" "lambda_duration" {

  alarm_name = "${var.project_name}-${var.environment}-lambda-duration"

  comparison_operator = "GreaterThanThreshold"

  evaluation_periods = 1

  metric_name = "Duration"

  namespace = "AWS/Lambda"

  period = 300

  statistic = "Average"

  threshold = 5000

  alarm_description = "Lambda execution exceeds 5 seconds."

  dimensions = {

    FunctionName = var.lambda_function_name

  }

}
resource "aws_cloudwatch_metric_alarm" "lambda_throttles" {

  alarm_name = "${var.project_name}-${var.environment}-lambda-throttles"

  comparison_operator = "GreaterThanThreshold"

  evaluation_periods = 1

  metric_name = "Throttles"

  namespace = "AWS/Lambda"

  period = 300

  statistic = "Sum"

  threshold = 0

  alarm_description = "Lambda throttling detected."

  dimensions = {

    FunctionName = var.lambda_function_name

  }

}