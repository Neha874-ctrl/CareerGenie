output "frontend_bucket_name" {
  description = "S3 bucket name for frontend"
  value       = module.s3.bucket_name
}

output "cloudfront_domain_name" {
  description = "CloudFront URL"
  value       = module.cloudfront.cloudfront_domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront Distribution ID"
  value       = module.cloudfront.cloudfront_distribution_id
}

output "api_gateway_url" {
  description = "API Gateway endpoint"
  value       = module.api_gateway.api_endpoint
}