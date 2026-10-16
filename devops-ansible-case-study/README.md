# DevOps Case Study & Ansible Automation

## Automated Web Server Configuration and Website Deployment Using Ansible

![Ansible](https://img.shields.io/badge/Automation-Ansible-EE0000?logo=ansible&logoColor=white)
![Ubuntu](https://img.shields.io/badge/OS-Ubuntu-E95420?logo=ubuntu&logoColor=white)
![Nginx](https://img.shields.io/badge/Web_Server-Nginx-009639?logo=nginx&logoColor=white)
![Status](https://img.shields.io/badge/Status-Implemented-success)

## 1. Project Overview

This project demonstrates the use of Ansible for automating web server configuration and website deployment in an Ubuntu environment running under Windows Subsystem for Linux (WSL).

The automation installs Nginx, creates a sample HTML homepage, and ensures that the web server service is running and enabled. Ansible inventory and playbook files define the target host and the configuration tasks.

The implementation also demonstrates playbook validation, connectivity testing, HTTP verification, and idempotency through repeated execution.

## 2. Objectives

- Understand the DevOps lifecycle and deployment workflow.
- Prepare an Ansible inventory to identify the target host.
- Develop an Ansible playbook for web server configuration.
- Automate Nginx installation and service management.
- Deploy a sample HTML homepage.
- Verify successful execution and website availability.
- Demonstrate Ansible idempotency.

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| Ubuntu on WSL | Execution environment |
| Ansible Core 2.16.3 | Configuration management and automation |
| YAML | Playbook configuration |
| Nginx | Web server |
| HTML | Homepage content |
| APT | Package management |
| systemd | Service management |
| curl | HTTP response verification |
| Git and GitHub | Version control and project hosting |

## 4. Project Architecture

The project uses a local configuration management architecture.

1. Ansible runs in the Ubuntu environment.
2. `inventory.ini` identifies `localhost` as the target.
3. `site.yml` defines the desired web server configuration.
4. Ansible installs Nginx, creates the homepage, and manages the service.
5. Nginx serves the homepage over HTTP.
6. The deployment is verified using `curl` and service status checks.

**Architecture flow:**

`Ubuntu / WSL → Ansible Inventory and Playbook → Local Target Host → Nginx Configuration → HTTP Response → Verification`

The target is local; this project does not configure a separate remote server.

## 5. Repository Structure

```text
devops-ansible-case-study/
├── inventory.ini
├── site.yml
├── README.md
└── screenshots/
    ├── ansible-version.png
    ├── inventory-validation.png
    ├── syntax-check.png
    ├── ansible-ping.png
    ├── playbook-execution.png
    ├── website-verification.png
    ├── nginx-status.png
    └── idempotency-test.png
```

The screenshot filenames above are suggested names. Add the corresponding screenshots captured from your actual execution.

## 6. Prerequisites

- Ubuntu Linux or Ubuntu running under WSL.
- Sudo privileges.
- Internet access for package installation.
- Ansible installed.
- Nginx package available through APT.

Verify Ansible installation:

```bash
ansible --version
```

## 7. Implementation

### Step 1: Create the project directory

```bash
mkdir -p ~/devops-ansible-case-study
cd ~/devops-ansible-case-study
```

### Step 2: Configure the Ansible inventory

Create `inventory.ini`:

```ini
[webservers]
localhost ansible_connection=local
```

The `webservers` group identifies the target group, while `ansible_connection=local` specifies local execution.

Validate the inventory:

```bash
ansible-inventory -i inventory.ini --list
```

### Step 3: Create the Ansible playbook

Create `site.yml`:

```yaml
---
- name: Configure and deploy a sample website
  hosts: webservers
  become: true

  tasks:
    - name: Install Nginx web server
      ansible.builtin.apt:
        name: nginx
        state: present
        update_cache: true

    - name: Create website homepage
      ansible.builtin.copy:
        dest: /var/www/html/index.html
        content: |
          <!DOCTYPE html>
          <html>
          <head>
            <title>DevOps Ansible Project</title>
          </head>
          <body>
            <h1>Deployment Successful!</h1>
            <p>This website is configured using Ansible.</p>
          </body>
          </html>
        owner: root
        group: root
        mode: "0644"

    - name: Start and enable Nginx
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true
```

### Step 4: Validate the playbook

```bash
ansible-playbook -i inventory.ini site.yml --syntax-check
```

Expected output:

```text
playbook: site.yml
```

### Step 5: Test connectivity

```bash
ansible -i inventory.ini webservers -m ansible.builtin.ping
```

Expected result:

```text
localhost | SUCCESS
"changed": false,
"ping": "pong"
```

### Step 6: Execute the playbook

```bash
ansible-playbook -i inventory.ini site.yml --ask-become-pass
```

Enter the Ubuntu sudo password when prompted.

The playbook performs three configuration tasks:

1. Installs Nginx.
2. Creates the HTML homepage.
3. Starts and enables the Nginx service.

### Step 7: Verify the website

Check the HTTP response:

```bash
curl http://localhost
```

The response should contain:

```html
<h1>Deployment Successful!</h1>
<p>This website is configured using Ansible.</p>
```

Check the Nginx service:

```bash
sudo systemctl status nginx
```

Confirm that the service is active and running.

## 8. Idempotency Testing

Execute the same playbook a second time:

```bash
ansible-playbook -i inventory.ini site.yml --ask-become-pass
```

The observed second execution produced:

```text
localhost : ok=4 changed=0 unreachable=0 failed=0
```

The zero-change result demonstrates that Ansible did not need to modify the configuration again because the target system already matched the desired state.

## 9. Execution Results

The following checks were completed successfully during implementation:

| Test | Result |
|---|---|
| Ansible installation | Passed |
| Inventory validation | Passed |
| Playbook syntax check | Passed |
| Ansible connectivity test | Passed |
| First playbook execution | Passed |
| Homepage HTTP verification | Passed |
| Nginx service verification | Passed |
| Second execution and idempotency | Passed |

The first execution reported `changed=1` and `failed=0`. The second execution reported `changed=0` and `failed=0`.

Refer to the `screenshots/` directory for supporting execution evidence.

## 10. DevOps Lifecycle

The project relates to the following DevOps stages:

1. **Plan:** Define the website deployment requirements.
2. **Code:** Prepare the HTML content, inventory, and playbook.
3. **Version Control:** Maintain project files in Git.
4. **Build and Test:** Validate inventory, connectivity, and playbook syntax.
5. **Configure and Deploy:** Use Ansible to configure Nginx and deploy the homepage.
6. **Operate and Verify:** Check the Nginx service and HTTP response.
7. **Feedback and Improvement:** Review execution output and improve the configuration.

Git-based collaboration and a full CI/CD pipeline are not implemented in this project. They are potential future extensions.

## 11. Security and Best Practices

- Use privilege escalation only for tasks that require administrative access.
- Do not commit passwords, private keys, or other secrets to GitHub.
- Keep inventory and playbook files readable and maintainable.
- Use declarative state parameters to support idempotent execution.
- Verify service status and application availability after deployment.

## 12. Limitations

- The playbook configures the local Ubuntu environment.
- A separate remote server is not used.
- A CI/CD pipeline is not implemented.
- Cloud provisioning, containerization, centralized monitoring, and high availability are outside the current scope.

## 13. Future Enhancements

- Configure remote Ubuntu hosts over SSH.
- Integrate GitHub with a CI/CD tool such as Jenkins.
- Package the application using Docker.
- Provision infrastructure on a cloud platform.
- Add automated HTTP health checks and monitoring.
- Organize the playbook into reusable Ansible roles.

## 14. Conclusion

This project demonstrates configuration management and web server deployment automation using Ansible. The inventory identifies the target host, and the playbook automates Nginx installation, homepage creation, and service management.

The implementation was verified through syntax checking, connectivity testing, successful execution, HTTP response inspection, and Nginx service status verification. A second execution reported zero changes and zero failures, demonstrating idempotent behavior.

The project provides a foundation for more advanced DevOps practices, including remote infrastructure management, version control, CI/CD integration, and monitoring.

## 15. References

1. Ansible Documentation: https://docs.ansible.com/ansible/latest/
2. Ansible Playbooks: https://docs.ansible.com/ansible/latest/playbook_guide/
3. Ansible Inventory Guide: https://docs.ansible.com/ansible/latest/inventory_guide/
4. Ansible Built-in Modules: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/
5. Nginx Documentation: https://nginx.org/en/docs/
6. Microsoft WSL Documentation: https://learn.microsoft.com/en-us/windows/wsl/

---

**Project:** DevOps Case Study & Ansible Automation  
**Implementation environment:** Ubuntu on WSL  
**Automation tool:** Ansible Core 2.16.3  
**Web server:** Nginx
