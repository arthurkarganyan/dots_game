# config valid for current version and patch releases of Capistrano
lock "~> 3.10.1"

set :application, "dots"
set :repo_url, "git@gitlab.com:arthur.karganyan/dotsgame.git"

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
PATH = "~/dots"
set :deploy_to, PATH

set :ssh_options, {:forward_agent => true}

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# append :linked_files, "config/database.yml", "config/secrets.yml"

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
set :keep_releases, 3

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure

# task :project_dir do
#   on roles(:app) do
#     execute "mkdir -P #{fetch(:deploy_to)}"
#   end
# end

# namespace :deploy do
# before :starting do
# end

# before :pub, :set_previous_path do
#   on roles(:docker), only: {primary: true} do
#     set :previous_release, capture("readlink -f '#{current_path}'")
#   end
# end
# end


task :sysinfo do
  on roles(:all) do |host|
    execute "free -mh"
    execute "df -h"
  end
end

namespace :deploy do

  desc 'Installs Docker if necessary'
  task :ensure_docker do
    on roles(:docker) do |host|
      res = capture "docker-compose -v || echo 0"

      if res == "0"
        ask(:sudo_password, nil, echo: false)

        # execute "wget -qO- https://get.docker.com/ | sh"

        # execute "echo #{fetch(:sudo_password)} | sudo usermod -aG docker ubuntu"
        cmd = "echo #{fetch(:sudo_password)} | "
        cmd << "sudo -S apt-get update && sudo apt-get install -y docker docker.io python-pip && "
        cmd << "sudo pip install docker-compose && "
        cmd << "sudo usermod -a -G docker $USER"
        execute cmd

        fail "Should be restarted!"
      end
      # "echo #{fetch(:sudo_password)} | sudo -S <command>"
      # sudo apt-get update
    end
  end

  task :build_image do
    on roles(:docker) do |host|
      cmd = "cd #{release_path} && "
      cmd << "docker build --build-arg DOMAIN_NAME=#{host.hostname} -t #{fetch(:application)} ."
      execute cmd
    end
  end

  task :compose_down do
    on roles(:docker) do |host|
      cmd = "cd #{release_path} && "
      # cmd << "docker-compose kill"
      cmd << "docker stop $(docker ps -a -q)"
      execute cmd
    end
  end

  task :compose_up do
    on roles(:docker) do |host|
      cmd = "cd #{release_path} && "
      cmd << "docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d"
      execute cmd
    end
  end

  task :compose_restart do
    on roles(:docker) do |host|
      invoke 'deploy:compose_down'
      invoke 'deploy:compose_up'
    end
  end

  task :docker_clean_up do
    on roles(:docker) do |host|
      execute "docker system prune -af"
    end
  end

  before 'deploy:starting', 'deploy:ensure_docker'

  after 'deploy:updating', 'deploy:build_image'
  after 'deploy:build_image', 'deploy:compose_restart'

  before 'deploy:cleanup', 'deploy:docker_clean_up'

  after 'deploy:finished', 'sysinfo'
end
