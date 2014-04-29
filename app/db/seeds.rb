# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Dir.foreach('db/sql') do |f|
  unless [".", "..", ".DS_Store"].include?(f)
    sql = File.open("db/sql/#{f}").read
    sql.split("\n").each do |sql_statement|
      ActiveRecord::Base.connection.execute(sql_statement)
    end
  end
end