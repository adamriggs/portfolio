json.array!(@projects) do |project|
  json.extract! project, :id, :agency, :client, :description, :link, :img
  json.url project_url(project, format: :json)
end
