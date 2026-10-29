# ========================================================
# TaskFlow Infrastructure as Code (Terraform)
# Provisions AWS VPC, Subnet, Security Group, and EC2 Instance
# ========================================================

# 1. Dedicated VPC
resource "aws_vpc" "taskflow_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "taskflow-${var.environment}-vpc"
  }
}

# 2. Internet Gateway
resource "aws_internet_gateway" "taskflow_igw" {
  vpc_id = aws_vpc.taskflow_vpc.id

  tags = {
    Name = "taskflow-${var.environment}-igw"
  }
}

# 3. Public Subnet
resource "aws_subnet" "taskflow_public_subnet" {
  vpc_id                  = aws_vpc.taskflow_vpc.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = var.availability_zone
  map_public_ip_on_launch = true

  tags = {
    Name = "taskflow-${var.environment}-public-subnet"
  }
}

# 4. Route Table
resource "aws_route_table" "taskflow_public_rt" {
  vpc_id = aws_vpc.taskflow_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.taskflow_igw.id
  }

  tags = {
    Name = "taskflow-${var.environment}-public-rt"
  }
}

# 5. Route Table Association
resource "aws_route_table_association" "taskflow_public_assoc" {
  subnet_id      = aws_subnet.taskflow_public_subnet.id
  route_table_id = aws_route_table.taskflow_public_rt.id
}

# 6. Security Group for Web Application and CI/CD
resource "aws_security_group" "taskflow_sg" {
  name        = "taskflow-${var.environment}-sg"
  description = "Security group for TaskFlow dashboard and Jenkins"
  vpc_id      = aws_vpc.taskflow_vpc.id

  # HTTP Traffic (Port 80)
  ingress {
    description = "Allow inbound HTTP for TaskFlow App"
    from_port   = var.app_port
    to_port     = var.app_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Jenkins CI/CD Traffic (Port 8080)
  ingress {
    description = "Allow inbound for Jenkins Controller/Dashboard"
    from_port   = var.jenkins_port
    to_port     = var.jenkins_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH Management (Port 22)
  ingress {
    description = "Allow SSH access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_allowed_cidr]
  }

  # Outbound rules (All traffic allowed)
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "taskflow-${var.environment}-sg"
  }
}

# 7. Data Source: Latest Ubuntu 22.04 LTS AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# 8. EC2 Application Server Instance
resource "aws_instance" "taskflow_server" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  subnet_id                   = aws_subnet.taskflow_public_subnet.id
  vpc_security_group_ids      = [aws_security_group.taskflow_sg.id]
  associate_public_ip_address = true

  # Automated provisioning script (User Data)
  user_data = <<-EOF
              #!/bin/bash
              set -e

              # Update system packages
              apt-get update -y
              apt-get install -y ca-certificates curl gnupg lsb-release git

              # Install Docker
              mkdir -p /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
              apt-get update -y
              apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

              # Start and enable Docker service
              systemctl start docker
              systemctl enable docker
              usermod -aG docker ubuntu

              # Pull and run the TaskFlow Docker container
              docker run -d --name taskflow-app -p 80:80 --restart unless-stopped nginx:alpine
              EOF

  tags = {
    Name = "taskflow-${var.environment}-app-server"
  }
}
