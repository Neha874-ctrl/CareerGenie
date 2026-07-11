output "vpc_id" {
  description = "ID of the VPC"

  value = aws_vpc.this.id
}

output "vpc_cidr" {
  description = "CIDR block of the VPC"

  value = aws_vpc.this.cidr_block
}

output "internet_gateway_id" {
  description = "Internet Gateway ID"

  value = aws_internet_gateway.this.id
}

output "public_subnet_1_id" {
  value = aws_subnet.public_1.id
}

output "public_subnet_2_id" {
  value = aws_subnet.public_2.id
}

output "private_subnet_1_id" {
  value = aws_subnet.private_1.id
}

output "private_subnet_2_id" {
  value = aws_subnet.private_2.id
}

output "public_route_table_id" {
  value = aws_route_table.public.id
}

output "private_route_table_id" {
  value = aws_route_table.private.id
}

output "nat_gateway_id" {
  value = aws_nat_gateway.this.id
}

output "lambda_security_group_id" {
  value = aws_security_group.lambda.id
}

output "elasticache_security_group_id" {
  value = aws_security_group.elasticache.id
}