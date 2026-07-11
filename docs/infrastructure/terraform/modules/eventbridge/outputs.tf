output "event_bus_name" {

  value = aws_cloudwatch_event_bus.career_events.name

}

output "event_bus_arn" {

  value = aws_cloudwatch_event_bus.career_events.arn

}