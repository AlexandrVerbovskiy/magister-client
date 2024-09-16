module "ecs_service" {
  source = "terraform-aws-modules/ecs/aws//modules/service"

  name        = "${var.environment}-${var.service.service_name}"
  cluster_arn = var.cluster_arn

  cpu                    = 1024
  memory                 = 4096
  enable_execute_command = true
  # tasks_iam_role_statements = var.tasks_iam_role_statements
  create_task_exec_iam_role = true
  container_definitions = {
    "${var.environment}-${var.service.service_name}" = {
      cpu       = 512
      memory    = 1024
      essential = true
      image     = var.image
      port_mappings = [
        {
          name          = "https"
          containerPort = 8080
          protocol      = "tcp"
        }
      ]

      readonly_root_filesystem = false
      enable_cloudwatch_logging = true
      memory_reservation = 100
      environment        = var.service.environment
    }
  }

  load_balancer = {
    service = {
      target_group_arn = data.aws_lb_target_group.this.arn
      container_name   = "${var.environment}-${var.service.service_name}"
      container_port   = 8080
    }
  }

  subnet_ids = var.subnet_ids
  security_group_rules = {
    alb_ingress_443 = {
      type        = "ingress"
      from_port   = 8080
      to_port     = 8080
      protocol    = "tcp"
      description = "Service port"
      cidr_blocks = ["0.0.0.0/0"]
    }
    egress_all = {
      type        = "egress"
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      cidr_blocks = ["0.0.0.0/0"]
    }
  }

  tags = {
    Environment = var.environment
    Terraform   = "true"
    Name        = "${var.environment}-${var.service.service_name}"
  }
}

output "service" {
  value = "${var.environment}-${var.service.service_name}"
}
