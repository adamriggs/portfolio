class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
	    t.string   "title"
	    t.string   "agency"
	    t.string   "client"
	    t.string   "thumb"
	    t.string   "img"
	    t.string   "link"
	    t.text   "description"
	    t.datetime "created_at"
	    t.datetime "updated_at"

		t.timestamps
    end
  end
end
