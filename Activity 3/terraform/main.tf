provider "docker" {
  host = "npipe:////.//pipe//docker_engine"
}

resource "docker_container" "taskflow" {
  name  = "taskflow-terraform"
  image = var.docker_image

  ports {
    internal = 80
    external = var.external_port
  }
}
