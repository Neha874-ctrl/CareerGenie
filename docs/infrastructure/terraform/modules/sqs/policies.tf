data "aws_iam_policy_document" "resume_queue_policy" {

  statement {

    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["sns.amazonaws.com"]
    }

    actions = [
      "sqs:SendMessage"
    ]

    resources = [
      aws_sqs_queue.resume_queue.arn
    ]

    condition {

      test = "ArnEquals"

      variable = "aws:SourceArn"

      values = [
        var.resume_uploaded_topic_arn
      ]
    }
  }
}

resource "aws_sqs_queue_policy" "resume_policy" {

  queue_url = aws_sqs_queue.resume_queue.id

  policy = data.aws_iam_policy_document.resume_queue_policy.json
}

data "aws_iam_policy_document" "job_queue_policy" {

  statement {

    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["sns.amazonaws.com"]
    }

    actions = [
      "sqs:SendMessage"
    ]

    resources = [
      aws_sqs_queue.job_queue.arn
    ]

    condition {

      test = "ArnEquals"

      variable = "aws:SourceArn"

      values = [
        var.job_applied_topic_arn
      ]
    }
  }
}

resource "aws_sqs_queue_policy" "job_policy" {

  queue_url = aws_sqs_queue.job_queue.id

  policy = data.aws_iam_policy_document.job_queue_policy.json
}

data "aws_iam_policy_document" "notification_queue_policy" {

  statement {

    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["sns.amazonaws.com"]
    }

    actions = [
      "sqs:SendMessage"
    ]

    resources = [
      aws_sqs_queue.notification_queue.arn
    ]

    condition {

      test = "ArnEquals"

      variable = "aws:SourceArn"

      values = [
        var.notifications_topic_arn
      ]
    }
  }
}

resource "aws_sqs_queue_policy" "notification_policy" {

  queue_url = aws_sqs_queue.notification_queue.id

  policy = data.aws_iam_policy_document.notification_queue_policy.json
}