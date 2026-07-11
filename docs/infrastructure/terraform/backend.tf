terraform {
  backend "s3" {
    bucket = "careergenie-terraform-state"
    key    = "dev/terraform.tfstate"
    region = "us-east-1"

  }
}