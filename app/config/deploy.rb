# Ensure that bundle is used for rake tasks
#SSHKit.config.command_map[:rake] = "bundle exec rake"

# config valid only for Capistrano 3.1
lock '3.2.1'

set :application, 'adamriggs.com'
set :deploy_user, 'deploy'

set :default_environment, {
  'PATH' => "/opt/ruby-enterprise/bin/:$PATH"
}
set :bundle_gemfile,  "app/Gemfile"

set :scm, :git
set :repo_url, 'https://github.com/adamriggs/portfolio.git'
set :branch, "master"
set :deploy_via, :remote_cache

# We are only going to use a single stage: production
set :stages, ["production"]

set :deploy_to, "/var/www/onosen.com/public_html/"

set :ssh_options, {
    forward_agent: false,
    auth_methods: %w(password),
    password: 'mu113nmu113n',
    user: 'deploy',
}

set :use_sudo, false

#set :rvm_ruby_version, '1.9.3-p448'
set :default_env, { rvm_bin_path: '~/.rvm/bin' }
SSHKit.config.command_map[:rake] = "#{fetch(:default_env)[:rvm_bin_path]}/rvm ruby-#{fetch(:rvm_ruby_version)} do bundle exec rake"

# ssh_options[:forward_agent] = true
# ssh_options[:keys] = [File.join(ENV["HOME"], ".ssh", "id_rsa")]


# set :rbenv_type, :system
# set :rbenv_ruby, '2.1.1'
# set :rbenv_prefix, "RBENV_ROOT#{fetch(:rbenv_path)} RBENV_VERSION=#{fetch(:rbenv_ruby)} #{fetch(:rbenv_path)}/bin/rbenv exec"
# set :rbenv_map_bins, %w{rake gem bundle ruby rails}

# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

# Default deploy_to directory is /var/www/my_app
# set :deploy_to, '/var/www/my_app'

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# set :linked_files, %w{config/database.yml}

# Default value for linked_dirs is []
# set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
set :keep_releases, 5

# what specs should be run before deployment is allowed to
# continue, see lib/capistrano/tasks/run_tests.cap
# set :tests, []

namespace :deploy do

	# make sure we're deploying what we think we're deploying
# 	before :deploy, "deploy:check_revision"
	# only allow a deploy with passing tests to deployed
# 	before :deploy, "deploy:run_tests"
	# compile assets locally then rsync
	#after 'deploy:symlink:shared', 'deploy:compile_assets_locally'
# 	after :finishing, 'deploy:cleanup'

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # Your restart mechanism here, for example:
      execute :touch, release_path.join('tmp/restart.txt')
    end
  end

  after :publishing, :restart

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end
  
   # As of Capistrano 3.1, the `deploy:restart` task is not called
  # automatically.
#   after 'deploy:publishing', 'deploy:restart'

end
