data "aws_iam_policy_document" "lambda_assume_role" {

  statement {

    effect = "Allow"

    principals {
      type = "Service"

      identifiers = [
        "lambda.amazonaws.com"
      ]
    }

    actions = [
      "sts:AssumeRole"
    ]
  }
}
resource "aws_iam_role" "lambda_role" {

  name = "${var.project_name}-${var.environment}-lambda-role"

  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}
resource "aws_iam_role_policy_attachment" "lambda_logging" {

  role = aws_iam_role.lambda_role.name

  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"

}
resource "aws_iam_role_policy_attachment" "lambda_dynamodb" {

  role = aws_iam_role.lambda_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"

}
resource "aws_iam_role_policy_attachment" "lambda_sns" {

  role = aws_iam_role.lambda_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonSNSFullAccess"

}
resource "aws_iam_role_policy_attachment" "lambda_sqs" {

  role = aws_iam_role.lambda_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonSQSFullAccess"

}
resource "aws_iam_role_policy_attachment" "lambda_eventbridge" {

  role = aws_iam_role.lambda_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonEventBridgeFullAccess"

}
resource "aws_iam_role_policy_attachment" "lambda_s3" {

  role = aws_iam_role.lambda_role.name

  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"

}