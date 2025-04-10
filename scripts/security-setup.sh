#!/bin/bash
# Security enhancement script for Portfolio application on Oracle VPS

# Log file
LOG_FILE="/home/ubuntu/portfolio/logs/security-setup.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Create logs directory if it doesn't exist
mkdir -p /home/ubuntu/portfolio/logs

# Log start of security setup
echo "${TIMESTAMP}: Starting security setup" >> $LOG_FILE

# Update and upgrade packages
echo "${TIMESTAMP}: Updating system packages" >> $LOG_FILE
sudo apt update && sudo apt upgrade -y >> $LOG_FILE 2>&1

# Install security packages
echo "${TIMESTAMP}: Installing security packages" >> $LOG_FILE
sudo apt install -y fail2ban ufw logwatch unattended-upgrades >> $LOG_FILE 2>&1

# Configure UFW (Uncomplicated Firewall)
echo "${TIMESTAMP}: Configuring firewall" >> $LOG_FILE
sudo ufw default deny incoming >> $LOG_FILE 2>&1
sudo ufw default allow outgoing >> $LOG_FILE 2>&1
sudo ufw allow ssh >> $LOG_FILE 2>&1
sudo ufw allow http >> $LOG_FILE 2>&1
sudo ufw allow https >> $LOG_FILE 2>&1
sudo ufw --force enable >> $LOG_FILE 2>&1
sudo ufw status >> $LOG_FILE 2>&1

# Configure Fail2ban
echo "${TIMESTAMP}: Configuring Fail2ban" >> $LOG_FILE
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
cat > /tmp/fail2ban-local << EOF
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 5
findtime = 600
bantime = 3600

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 5
findtime = 600
bantime = 3600
EOF

sudo cat /tmp/fail2ban-local >> /etc/fail2ban/jail.local
sudo systemctl restart fail2ban >> $LOG_FILE 2>&1
sudo systemctl status fail2ban | head -3 >> $LOG_FILE

# Configure automatic security updates
echo "${TIMESTAMP}: Configuring automatic security updates" >> $LOG_FILE
cat > /tmp/20auto-upgrades << EOF
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF

sudo cp /tmp/20auto-upgrades /etc/apt/apt.conf.d/20auto-upgrades

# Secure shared memory
echo "${TIMESTAMP}: Securing shared memory" >> $LOG_FILE
if ! grep -q "/run/shm" /etc/fstab; then
    echo "tmpfs /run/shm tmpfs defaults,noexec,nosuid 0 0" | sudo tee -a /etc/fstab >> $LOG_FILE 2>&1
fi

# Secure SSH
echo "${TIMESTAMP}: Securing SSH configuration" >> $LOG_FILE
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
cat > /tmp/sshd_config_changes << EOF
PermitRootLogin no
PasswordAuthentication no
X11Forwarding no
MaxAuthTries 5
ClientAliveInterval 300
ClientAliveCountMax 0
UsePAM yes
EOF

sudo cat /tmp/sshd_config_changes >> /etc/ssh/sshd_config
sudo systemctl restart ssh >> $LOG_FILE 2>&1

# Set up logwatch for daily security reports
echo "${TIMESTAMP}: Setting up logwatch for daily security reports" >> $LOG_FILE
cat > /tmp/logwatch.conf << EOF
Output = mail
Format = html
MailTo = root
MailFrom = logwatch@$(hostname)
Range = yesterday
Detail = Medium
Service = All
EOF

sudo cp /tmp/logwatch.conf /etc/logwatch/conf/logwatch.conf

# Check for rootkits
echo "${TIMESTAMP}: Installing and running rootkit scanner" >> $LOG_FILE
sudo apt install -y rkhunter >> $LOG_FILE 2>&1
sudo rkhunter --update >> $LOG_FILE 2>&1
sudo rkhunter --check --skip-keypress >> $LOG_FILE 2>&1

# Log end of security setup
echo "${TIMESTAMP}: Security setup completed" >> $LOG_FILE
echo "----------------------------------------" >> $LOG_FILE

echo "Security setup completed! Please review the log file at $LOG_FILE for details."
echo "IMPORTANT: Make sure you have set up SSH key authentication before disabling password authentication!"