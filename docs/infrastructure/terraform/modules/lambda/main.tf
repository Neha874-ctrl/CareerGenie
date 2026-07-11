resource "aws_iam_role" "lambda_role" {

  name = "${var.project_name}-${var.environment}-lambda-role"

  assume_role_policy = jsonencode({

    Version = "2012-10-17"

    Statement = [

      {

        Action = "sts:AssumeRole"

        Effect = "Allow"

        Principal = {

          Service = "lambda.amazonaws.com"

        }

      }

    ]

  })

}

resource "aws_iam_role_policy_attachment" "basic" {

  role = aws_iam_role.lambda_role.name

  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

}

resource "aws_iam_role_policy_attachment" "vpc" {

  role = aws_iam_role.lambda_role.name

  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"

}

resource "aws_lambda_function" "backend" {

  function_name = "${var.project_name}-${var.environment}-backend"

  role = var.lambda_role_arn

  runtime = "nodejs20.x"

  handler = "index.handler"

  filename = "${path.module}/lambda.zip"

  timeout = 30

  memory_size = 512

  vpc_config {
    subnet_ids = var.private_subnet_ids

    security_group_ids = [
      var.lambda_security_group_id
    ]
  }
}