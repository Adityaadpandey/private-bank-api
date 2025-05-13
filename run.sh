#!/bin/bash

SESSION="microstack"

# Kill old session if it exists
tmux kill-session -t $SESSION 2>/dev/null

# Start new session
tmux new-session -d -s $SESSION -n docker

# Pane 0: Docker Compose
tmux send-keys -t $SESSION 'docker compose up' C-m

# Pane 1: API Gateway
tmux split-window -v -t $SESSION
tmux select-pane -t 1
tmux send-keys -t $SESSION 'cd api-gateway && npm start' C-m

# Pane 2: Auth Service
tmux split-window -h -t $SESSION
tmux select-pane -t 2
tmux send-keys -t $SESSION 'cd auth-service && npm start' C-m

# Pane 3: Account Service
tmux split-window -v -t $SESSION
tmux select-pane -t 3
tmux send-keys -t $SESSION 'cd account-service && npm start' C-m

# Pane 4: Transaction Service
tmux split-window -h -t $SESSION
tmux select-pane -t 4
tmux send-keys -t $SESSION 'cd transaction-services && npm start' C-m

# Select layout
tmux select-layout -t $SESSION tiled

# Attach to the session
tmux attach-session -t $SESSION
