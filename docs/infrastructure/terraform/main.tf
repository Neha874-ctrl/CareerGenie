# Root module
#vpc

module "vpc" {

  source = "./modules/vpc"

  project_name = var.project_name
  environment  = var.environment

  vpc_cidr = var.vpc_cidr

  availability_zone_1 = var.availability_zone_1
  availability_zone_2 = var.availability_zone_2

  public_subnet_1_cidr = var.public_subnet_1_cidr
  public_subnet_2_cidr = var.public_subnet_2_cidr

  private_subnet_1_cidr = var.private_subnet_1_cidr
  private_subnet_2_cidr = var.private_subnet_2_cidr
}


module "s3" {
  source = "./modules/s3"

  project_name = var.project_name
  environment  = var.environment


}
# Networking
# Storage
module "cloudfront" {
  source = "./modules/cloudfront"

  project_name = var.project_name
  environment  = var.environment

  bucket_name        = module.s3.bucket_name
  bucket_domain_name = module.s3.bucket_domain_name
  bucket_arn         = module.s3.bucket_arn

  depends_on = [
    module.s3
  ]
}

#lambda
module "lambda" {

  source = "./modules/lambda"

  project_name = var.project_name

  environment = var.environment

  private_subnet_ids = [
    module.vpc.private_subnet_1_id,
    module.vpc.private_subnet_2_id
  ]

  lambda_security_group_id = module.vpc.lambda_security_group_id

  lambda_role_arn = module.iam.lambda_role_arn
}
# Compute
# Database

module "cloudwatch" {

  source = "./modules/cloudwatch"

  project_name = var.project_name

  environment = var.environment

  lambda_function_name = module.lambda.lambda_function_name

}
# Messaging
# Monitoring


module "api_gateway" {

  source = "./modules/api_gateway"

  project_name = var.project_name

  environment = var.environment

  lambda_invoke_arn = module.lambda.lambda_invoke_arn

  lambda_function_name = module.lambda.lambda_function_name

}

# Resources and modules will be added incrementally.

module "dynamodb" {

  source = "./modules/dynamodb"

  project_name = var.project_name

  environment = var.environment

}

module "sns" {

  source = "./modules/sns"

  project_name = var.project_name

  environment = var.environment

}

module "sqs" {

  source = "./modules/sqs"

  project_name = var.project_name

  environment = var.environment

  resume_uploaded_topic_arn = module.sns.resume_uploaded_topic_arn

  job_applied_topic_arn = module.sns.job_applied_topic_arn

  notifications_topic_arn = module.sns.notifications_topic_arn
}

module "eventbridge" {

  source = "./modules/eventbridge"

  project_name = var.project_name

  environment = var.environment

}

module "iam" {

  source = "./modules/iam"

  project_name = var.project_name

  environment = var.environment

}

module "budgets" {

  source = "./modules/budgets"

  project_name = var.project_name

  environment = var.environment

  budget_limit = 2

  email = var.notification_email

}