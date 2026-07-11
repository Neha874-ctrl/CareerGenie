provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "CareerGenie"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "Neha Sharma"
    }
  }
}