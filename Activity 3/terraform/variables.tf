variable "aws_region" {
  description = "AWS region for provisioning resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for the dedicated TaskFlow VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "availability_zone" {
  description = "Availability zone for the public subnet"
  type        = string
  default     = "us-east-1a"
}

variable "instance_type" {
  description = "EC2 Instance type for the TaskFlow host"
  type        = string
  default     = "t3.micro"
}

variable "app_port" {
  description = "Host port where TaskFlow web app is published"
  type        = number
  default     = 80
}

variable "jenkins_port" {
  description = "Port for Jenkins CI/CD controller/agent communication"
  type        = number
  default     = 8080
}

variable "ssh_allowed_cidr" {
  description = "CIDR block permitted to SSH into the instance"
  type        = string
  default     = "0.0.0.0/0"
}
