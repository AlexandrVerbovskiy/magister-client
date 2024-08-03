variable "environment" {
  type = string
}
variable "service" {
  description = "List of ECS services to be deployed"
}
variable "cluster_arn" {
  type = string
}
variable "subnet_ids" {
  type = list(any)
}
variable "image" {
  type    = string
  default = "211125642419.dkr.ecr.eu-west-2.amazonaws.com/client:latest2"
}
variable "tasks_iam_role_statements" {
  description = "Permissions for ECS task"
  default     = []
}
