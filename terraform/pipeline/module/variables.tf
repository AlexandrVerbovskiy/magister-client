variable "artifacts_bucket_name" {
  type    = string
  default = "codepipeline-artifacts-211125642419"
}
variable "artifacts_bucket_arn" {
  type    = string
  default = "arn:aws:s3:::codepipeline-artifacts-211125642419"
}
variable "app_name" {
  type = string
}
variable "environment" {
  type = string
}
variable "branch" {
  type = string
}
variable "repository_name" {
  type = string
}