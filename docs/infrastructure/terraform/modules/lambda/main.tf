data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.root}/../../backend"
  output_path = "${path.module}/lambda.zip"

  excludes = [
    ".git",
    ".env",
    "node_modules/.cache"
  ]
}

resource "aws_lambda_function" "backend" {

  function_name = "${var.project_name}-${var.environment}-backend"

  role = var.lambda_role_arn

  runtime = "nodejs20.x"

  handler = "src/lambda.handler"

  filename = data.archive_file.lambda_zip.output_path

  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  timeout     = 30
  memory_size = 512

  vpc_config {
    subnet_ids = var.private_subnet_ids

    security_group_ids = [
      var.lambda_security_group_id
    ]
  }

  environment {
    variables = {
      NODE_ENV       = "production"
      MONGO_URI      = var.mongo_uri
      JWT_SECRET     = var.jwt_secret
      GEMINI_API_KEY = var.gemini_api_key
      CLIENT_URL     = var.client_url
    }
  }
}
