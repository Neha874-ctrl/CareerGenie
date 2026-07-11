resource "aws_sns_topic" "career_events" {

  name = "${var.project_name}-${var.environment}-events"

}
resource "aws_sns_topic" "resume_uploaded" {

  name = "${var.project_name}-${var.environment}-resume-uploaded"

}
resource "aws_sns_topic" "job_applied" {

  name = "${var.project_name}-${var.environment}-job-applied"

}
resource "aws_sns_topic" "notifications" {

  name = "${var.project_name}-${var.environment}-notifications"

}
