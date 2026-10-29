variable "docker_image" {
  description = "Docker image used by the TaskFlow application"
  type        = string
  default     = "taskflow-app:latest"
}

variable "external_port" {
  description = "Port exposed on the local computer"
  type        = number
  default     = 8083
}
