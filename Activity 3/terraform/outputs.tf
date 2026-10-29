output "vpc_id" {
  description = "ID of the created VPC"
  value       = aws_vpc.taskflow_vpc.id
}

output "subnet_id" {
  description = "ID of the created public subnet"
  value       = aws_subnet.taskflow_public_subnet.id
}

output "security_group_id" {
  description = "ID of the application security group"
  value       = aws_security_group.taskflow_sg.id
}

output "instance_id" {
  description = "ID of the provisioned EC2 instance"
  value       = aws_instance.taskflow_server.id
}

output "instance_public_ip" {
  description = "Public IP address of the provisioned EC2 server"
  value       = aws_instance.taskflow_server.public_ip
}

output "app_url" {
  description = "Direct HTTP access URL for the TaskFlow web application"
  value       = "http://${aws_instance.taskflow_server.public_ip}:${var.app_port}"
}
