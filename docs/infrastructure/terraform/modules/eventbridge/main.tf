resource "aws_cloudwatch_event_bus" "career_events" {

  name = "${var.project_name}-${var.environment}-bus"

}

resource "aws_cloudwatch_event_rule" "resume_uploaded" {

  name = "${var.project_name}-${var.environment}-resume"

  event_bus_name = aws_cloudwatch_event_bus.career_events.name

  event_pattern = jsonencode({

    source = [

      "careergenie.resume"

    ]

    detail-type = [

      "ResumeUploaded"

    ]

  })

}

resource "aws_cloudwatch_event_rule" "job_applied" {

  name = "${var.project_name}-${var.environment}-job"

  event_bus_name = aws_cloudwatch_event_bus.career_events.name

  event_pattern = jsonencode({

    source = [

      "careergenie.jobs"

    ]

    detail-type = [

      "JobApplied"

    ]

  })

}

resource "aws_cloudwatch_event_rule" "notification" {

  name = "${var.project_name}-${var.environment}-notification"

  event_bus_name = aws_cloudwatch_event_bus.career_events.name

  event_pattern = jsonencode({

    source = [

      "careergenie.notification"

    ]

    detail-type = [

      "NotificationCreated"

    ]

  })

}