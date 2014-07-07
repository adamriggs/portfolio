# Simple Role Syntax
# ==================
# Supports bulk-adding hosts to roles, the primary server in each group
# is considered to be the first unless any hosts have the primary
# property set.  Don't declare `role :all`, it's a meta role.

# role :app, %w{deploy@96.126.98.106}
# role :web, %w{deploy@96.126.98.106}
# role :db,  %w{deploy@96.126.98.106}


# Extended Server Syntax
# ======================
# This can be used to drop a more detailed server definition into the
# server list. The second argument is a, or duck-types, Hash and is
# used to set extended properties on the server.

set :stage, :production
set :branch, "master"

set :full_app_name, "#{fetch(:application)}_#{fetch(:stage)}"
set :server_name, "www.onosen.com onosen.com"
# set :bundle_gemfile,  "app/Gemfile"

server '96.126.98.106', user: 'deploy', roles: %w{app web db}, primary: true


# server "96.126.98.106", roles: %{web app db}, ssh_options: {
#     user: "deploy",
#     forward_agent: true,
#     auth_methods: %w(password)
# }
set :deploy_to, "/var/www/onosen.com/public_html/"


# Custom SSH Options
# ==================
# You may pass any option but keep in mind that net/ssh understands a
# limited set of options, consult[net/ssh documentation](http://net-ssh.github.io/net-ssh/classes/Net/SSH.html#method-c-start).
#
# Global options
# --------------
#  set :ssh_options, {
#    keys: %w(/home/rlisowski/.ssh/id_rsa),
#    forward_agent: false,
#    auth_methods: %w(password)
#  }
#
# And/or per server (overrides global)
# ------------------------------------
# server 'example.com',
#   user: 'user_name',
#   roles: %w{web app},
#   ssh_options: {
#     user: 'user_name', # overrides user setting above
#     keys: %w(/home/user_name/.ssh/id_rsa),
#     forward_agent: false,
#     auth_methods: %w(publickey password)
#     # password: 'please use keys'
#   }
