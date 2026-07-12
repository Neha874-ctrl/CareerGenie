resource "aws_cloudfront_origin_access_control" "this" {
  name                              = "${var.project_name}-${var.environment}-oac"
  description                       = "Origin Access Control for S3"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}


resource "aws_cloudfront_distribution" "this" {

  enabled             = true
  default_root_object = "index.html"


  # =========================
  # FRONTEND S3 ORIGIN
  # =========================

  origin {
    domain_name = var.bucket_domain_name
    origin_id   = "frontend-origin"

    origin_access_control_id = aws_cloudfront_origin_access_control.this.id

    s3_origin_config {
      origin_access_identity = ""
    }
  }


  # =========================
  # API GATEWAY ORIGIN
  # =========================

  origin {

    domain_name = replace(
      replace(var.api_gateway_url, "https://", ""),
      "/", ""
    )

    origin_id = "backend-origin"


    custom_origin_config {

      http_port  = 80
      https_port = 443

      origin_protocol_policy = "https-only"

      origin_ssl_protocols = [
        "TLSv1.2"
      ]
    }
  }



  # =========================
  # FRONTEND DEFAULT ROUTE
  # =========================

  default_cache_behavior {

    target_origin_id = "frontend-origin"


    viewer_protocol_policy = "redirect-to-https"


    allowed_methods = [
      "GET",
      "HEAD"
    ]

    cached_methods = [
      "GET",
      "HEAD"
    ]


    compress = true


    forwarded_values {

      query_string = false

      cookies {
        forward = "none"
      }
    }
  }



  # =========================
  # BACKEND API ROUTES
  # =========================

  ordered_cache_behavior {


    path_pattern = "/api/*"


    target_origin_id = "backend-origin"



    viewer_protocol_policy = "https-only"



    allowed_methods = [
      "GET",
      "HEAD",
      "OPTIONS",
      "POST",
      "PUT",
      "PATCH",
      "DELETE"
    ]


    cached_methods = [
      "GET",
      "HEAD"
    ]



    forwarded_values {

      query_string = true


      headers = [
        "Authorization",
        "Origin",
        "Content-Type"
      ]


      cookies {
        forward = "all"
      }
    }


  }



  restrictions {

    geo_restriction {

      restriction_type = "none"

    }

  }



  viewer_certificate {

    cloudfront_default_certificate = true

  }


  price_class = "PriceClass_100"



  custom_error_response {

    error_code = 403

    response_code = 200

    response_page_path = "/index.html"

    error_caching_min_ttl = 0

  }



  custom_error_response {

    error_code = 404

    response_code = 200

    response_page_path = "/index.html"

    error_caching_min_ttl = 0

  }

}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = var.bucket_name

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"

        Principal = {
          Service = "cloudfront.amazonaws.com"
        }

        Action = "s3:GetObject"

        Resource = "${var.bucket_arn}/*"

        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.this.arn
          }
        }
      }
    ]
  })
}