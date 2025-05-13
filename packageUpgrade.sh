#!/bin/bash

set -e

SERVICES=("api-gateway" "auth-service" "account-service" "transaction-services")
PIDS=()

spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    while [ -d /proc/$pid ]; do
        local temp=${spinstr#?}
        printf " [%c] Installing dependencies...\r" "$spinstr"
        spinstr=$temp${spinstr%"$temp"}
        sleep $delay
    done
    printf "    \r"  # Clean up spinner line
}

log_success() {
    echo -e "✅ $1 installed successfully."
}

log_start() {
    echo -e "🚀 Installing $1..."
}

echo "📦 Starting install for all services..."

for service in "${SERVICES[@]}"; do
    (
        log_start "$service"
        cd "$service" && npm install
    ) &
    PIDS+=($!)
done

# Start spinner for each install
for i in "${!PIDS[@]}"; do
    wait "${PIDS[$i]}"
    log_success "${SERVICES[$i]}"
done

echo -e "\n🎉 All services installed successfully."
