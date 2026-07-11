variable "project_name" {
  description = "Project Name"
  type        = string
}

variable "environment" {
  description = "Environment"
  type        = string
}

variable "budget_limit" {
  description = "Monthly budget in USD"
  type        = number
  default     = 2
}

variable "email" {
  description = "Email for budget notifications"
  type        = string
}