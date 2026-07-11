variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR"
  type        = string
}

variable "public_subnet_1_cidr" {
  description = "Public subnet 1 CIDR"
  type        = string
}

variable "public_subnet_2_cidr" {
  description = "Public subnet 2 CIDR"
  type        = string
}

variable "private_subnet_1_cidr" {
  description = "Private subnet 1 CIDR"
  type        = string
}

variable "private_subnet_2_cidr" {
  description = "Private subnet 2 CIDR"
  type        = string
}

variable "availability_zone_1" {
  description = "First Availability Zone"
  type        = string
}

variable "availability_zone_2" {
  description = "Second Availability Zone"
  type        = string
}