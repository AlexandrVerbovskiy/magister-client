data "aws_iam_policy_document" "assume_role_codebuild" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["codebuild.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "this" {
  name               = "${var.environment}-${var.app_name}"
  assume_role_policy = data.aws_iam_policy_document.assume_role_codebuild.json
}

data "aws_iam_policy_document" "this" {

  statement {
    effect = "Allow"

    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:PutImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
      "ssm:GetParameter"
    ]

    resources = ["*"]
  }

  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["*"]
  }

  statement {
    effect = "Allow"

    actions = [
      "ec2:CreateNetworkInterface",
      "ec2:DescribeDhcpOptions",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DeleteNetworkInterface",
      "ec2:DescribeSubnets",
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeSecurityGroupRules",
      "ec2:DescribeVpcs",
      "elasticloadbalancing:Describe*",
      "logs:*",
      "iam:List*",
      "iam:Get*",
      "iam:PassRole",
      "ecs:*",
      "application-autoscaling:*"
    ]
    resources = ["*"]
  }
  statement {
    effect = "Deny"

    actions = [
      "ecs:DeleteCluster"
    ]
    resources = ["*"]
  }
  statement {
    effect  = "Allow"
    actions = ["s3:*"]
    resources = [
      var.artifacts_bucket_arn,
      "${var.artifacts_bucket_arn}/*",
    ]
  }
  statement {
    effect = "Allow"

    actions = [
      "s3:ListBucket"
    ]

    resources = ["arn:aws:s3:::terraform-states-211125642419"]
  }
  statement {
    effect = "Allow"

    actions = [
      "s3:GetObject",
      "s3:PutObject"
    ]

    resources = ["arn:aws:s3:::terraform-states-211125642419/*"]
  }
  statement {
    effect = "Allow"

    actions = [
      "ssm:GetParameter"
    ]

    resources = ["arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.id}:parameter/${var.environment}/${var.app_name}/*"]
  }
}

resource "aws_iam_role_policy" "this" {
  role   = aws_iam_role.this.name
  policy = data.aws_iam_policy_document.this.json
}

resource "aws_codebuild_project" "build" {

  name          = "${var.environment}-${var.app_name}-build"
  description   = "${var.environment} ${var.app_name} build project"
  build_timeout = 5
  service_role  = aws_iam_role.this.arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux2-x86_64-standard:5.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      name  = "APP_NAME"
      value = var.app_name
    }
    environment_variable {
      name  = "ENVIRONMENT"
      value = var.environment
    }
  }
  source {
    type      = "CODEPIPELINE"
    buildspec = "terraform/buildspec-build.yml"
  }

  logs_config {
    cloudwatch_logs {
      group_name  = "log-group"
      stream_name = "log-stream"
    }

    s3_logs {
      status   = "ENABLED"
      location = "${var.artifacts_bucket_name}/build-log"
    }
  }

  tags = {
    Environment = var.environment
  }
}

resource "aws_codebuild_project" "plan" {

  name          = "${var.environment}-${var.app_name}-plan"
  description   = "${var.environment} ${var.app_name} plan project"
  build_timeout = 5
  service_role  = aws_iam_role.this.arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "public.ecr.aws/hashicorp/terraform:1.7"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      name  = "APP_NAME"
      value = var.app_name
    }
    environment_variable {
      name  = "ENVIRONMENT"
      value = var.environment
    }
  }
  source {
    type      = "CODEPIPELINE"
    buildspec = "terraform/buildspec-plan.yml"
  }

  logs_config {
    cloudwatch_logs {
      group_name  = "log-group"
      stream_name = "log-stream"
    }

    s3_logs {
      status   = "ENABLED"
      location = "${var.artifacts_bucket_name}/build-log"
    }
  }

  tags = {
    Environment = var.environment
  }
}
resource "aws_codebuild_project" "apply" {

  name          = "${var.environment}-${var.app_name}-apply"
  description   = "${var.environment} ${var.app_name} apply project"
  build_timeout = 5
  service_role  = aws_iam_role.this.arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "public.ecr.aws/hashicorp/terraform:1.7"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      name  = "APP_NAME"
      value = var.app_name
    }
    environment_variable {
      name  = "ENVIRONMENT"
      value = var.environment
    }
  }
  source {
    type      = "CODEPIPELINE"
    buildspec = "terraform/buildspec-apply.yml"
  }

  logs_config {
    cloudwatch_logs {
      group_name  = "log-group"
      stream_name = "log-stream"
    }

    s3_logs {
      status   = "ENABLED"
      location = "${var.artifacts_bucket_name}/build-log"
    }
  }

  tags = {
    Environment = var.environment
  }
}
resource "aws_security_group" "codebuild" {
  name        = "${var.environment}-${var.app_name}"
  description = "${var.environment} ${var.app_name} security group"
  vpc_id      = "vpc-0cee920c5e043d7cc"

  ingress {
    description = "within VPC"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Environment = var.environment
  }
}
