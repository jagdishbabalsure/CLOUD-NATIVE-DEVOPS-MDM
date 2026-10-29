output "taskflow_url" {
  description = "URL to access the TaskFlow application"
  value       = "http://localhost:${var.external_port}"
}

output "container_name" {
  description = "Name of the Docker container managed by Terraform"
  value       = docker_container.taskflow.name
}
