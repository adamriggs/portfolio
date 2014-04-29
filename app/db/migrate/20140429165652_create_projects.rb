class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :agency
      t.string :client
      t.string :description
      t.string :link
      t.string :img

      t.timestamps
    end
  end
end
