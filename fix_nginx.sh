#!/bin/bash

echo "=== Config Nginx client_max_body_size ==="
# 1. Update /etc/nginx/nginx.conf
if ! grep -q "client_max_body_size" /etc/nginx/nginx.conf; then
    sudo sed -i '/http {/a \    client_max_body_size 100M;' /etc/nginx/nginx.conf
    echo "✔ Added client_max_body_size 100M to /etc/nginx/nginx.conf"
else
    # Update existing value to 100M
    sudo sed -i 's/client_max_body_size [0-9]\+[M|k|g]\?/client_max_body_size 100M/g' /etc/nginx/nginx.conf
    echo "✔ Updated client_max_body_size to 100M in /etc/nginx/nginx.conf"
fi

# 2. Update /etc/nginx/sites-available/default
if [ -f /etc/nginx/sites-available/default ]; then
    if ! grep -q "client_max_body_size" /etc/nginx/sites-available/default; then
        sudo sed -i '/server {/a \    client_max_body_size 100M;' /etc/nginx/sites-available/default
        echo "✔ Added client_max_body_size 100M to /etc/nginx/sites-available/default"
    else
        sudo sed -i 's/client_max_body_size [0-9]\+[M|k|g]\?/client_max_body_size 100M/g' /etc/nginx/sites-available/default
        echo "✔ Updated client_max_body_size to 100M in /etc/nginx/sites-available/default"
    fi
fi

# 3. Test and restart Nginx
echo "=== Testing Nginx config ==="
sudo nginx -t
if [ $? -eq 0 ]; then
    echo "=== Restarting Nginx ==="
    sudo systemctl restart nginx
    echo "✔ Nginx restarted successfully"
else
    echo "❌ Nginx configuration test failed!"
    exit 1
fi

# 4. Build Frontend
echo "=== Building Frontend ==="
cd /var/www/pms-source/frontEnd
npm install
npm run build
echo "✔ Frontend built successfully"

# 5. Restart Backend PM2
echo "=== Restarting Backend ==="
pm2 restart all
echo "✔ PM2 apps restarted successfully"
