# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "precise64"

  config.vm.box_url = "http://files.vagrantup.com/precise64.box"
  config.vm.hostname = "portfolio"
  
  config.vm.provider :virtualbox do |vm|
      vm.customize ["modifyvm", :id, "--memory", 1536]
      vm.customize ["modifyvm", :id, "--cpus", "2"]
      vm.customize ["modifyvm", :id, "--ioapic", "on"]
      vm.customize ["modifyvm", :id, "--nictype1", "virtio"]
  end
  config.vm.network :forwarded_port, guest: 3000, host: 3000
  config.vm.network :forwarded_port, guest: 3306, host: 3307
  
  config.vm.synced_folder "app", "/home/vagrant/app", :create => true
  
  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = ["cookbooks"]
    chef.add_recipe "apt"
    chef.add_recipe "build-essential"
    chef.add_recipe "rvm::vagrant"
    chef.add_recipe "rvm::system"
    chef.add_recipe "git"
    chef.add_recipe "nodejs"
    chef.add_recipe "mysql::server"
   	#chef.add_recipe "mysql::client"
    
    chef.json.merge!({ 
      :mysql => {
        :server_root_password => "mu113n",
        :server_repl_password => "vagrant",
        :server_debian_password => "vagrant",
        :allow_remote_root => true,
      },
      :rvm => {
        :default_ruby => "1.9.3",
        :rubies => ["1.9.3"],
        :global_gems => [
          { :name => "bundler" },
          { :name => "rails" }
        ]
      }
      
    })
  end
  
end
