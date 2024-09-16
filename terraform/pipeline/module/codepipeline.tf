resource "aws_codepipeline" "app_codepipeline" {
  name           = "${var.environment}-${var.app_name}"
  role_arn       = aws_iam_role.codepipeline_role.arn
  pipeline_type  = "V2"
  execution_mode = "QUEUED"
  artifact_store {
    location = var.artifacts_bucket_name
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["source_output"]

      configuration = {
        ConnectionArn    = "arn:aws:codestar-connections:eu-west-2:211125642419:connection/af8634fb-d286-4b21-8e36-43ea43c75a20"
        FullRepositoryId = var.repository_name
        BranchName       = var.branch
      }
    }
  }

  stage {
    name = "Build"

    action {
      name             = "Build"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["source_output"]
      output_artifacts = ["build_output"]
      version          = "1"

      configuration = {
        ProjectName =  aws_codebuild_project.build.name
      }
    }
  }
  stage {
    name = "Plan"

    action {
      name             = "Plan"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["source_output"]
      output_artifacts = ["plan_output"]
      version          = "1"

      configuration = {
        ProjectName = aws_codebuild_project.plan.name
      }
    }
  }
  dynamic "stage" {
    for_each = var.environment == "dev" ? [] : [1]
    content {
      name = "Approve"

      action {
        name     = "Approval"
        category = "Approval"
        owner    = "AWS"
        provider = "Manual"
        version  = "1"
      }
    }
  }
  stage {
    name = "Deploy"

    action {
      name             = "Deploy"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["plan_output"]
      output_artifacts = ["deploy_output"]
      version          = "1"

      configuration = {
        ProjectName = aws_codebuild_project.apply.name
      }
    }
  }
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["codepipeline.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "codepipeline_role" {
  name               = "${var.environment}-${var.app_name}-codepipeline-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "aws_iam_policy_document" "codepipeline_policy" {
  statement {
    effect = "Allow"

    actions = [
      "s3:GetObject",
      "s3:GetObjectVersion",
      "s3:GetBucketVersioning",
      "s3:PutObjectAcl",
      "s3:PutObject",
    ]

    resources = [
      var.artifacts_bucket_arn,
      "${var.artifacts_bucket_arn}/*"
    ]
  }

  statement {
    effect = "Allow"
    actions = [
      "ecs:RegisterTaskDefinition",
      "ecs:UpdateService",
      "ecs:Describe*",
      "ecs:RunTask",
      "ecs:Tag*",
      "codestar-connections:UseConnection"
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"

    actions = [
      "codebuild:BatchGetBuilds",
      "codebuild:StartBuild",
    ]

    resources = ["*"]
  }

  statement {
    actions   = ["iam:PassRole"]
    effect    = "Allow"
    resources = ["*"]

    condition {
      test     = "StringLike"
      variable = "iam:PassedToService"
      values   = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy" "codepipeline_policy" {

  name   = "${var.environment}-${var.app_name}-codepipeline-policy"
  role   = aws_iam_role.codepipeline_role.id
  policy = data.aws_iam_policy_document.codepipeline_policy.json
}
