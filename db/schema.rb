# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_09_24_025245) do

  create_table "comments", force: :cascade do |t|
    t.string "content"
    t.integer "mission_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.index ["mission_id"], name: "index_comments_on_mission_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "mission_lists", force: :cascade do |t|
    t.string "name"
    t.integer "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_mission_lists_on_project_id"
  end

  create_table "missions", force: :cascade do |t|
    t.string "name"
    t.boolean "is_finish"
    t.integer "mission_list_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "summary"
    t.integer "user_id"
    t.datetime "finish_time"
    t.integer "creator"
    t.index ["mission_list_id"], name: "index_missions_on_mission_list_id"
    t.index ["user_id"], name: "index_missions_on_user_id"
  end

  create_table "projects", force: :cascade do |t|
    t.text "name"
    t.integer "team_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "summary"
    t.string "icon"
    t.index ["team_id"], name: "index_projects_on_team_id"
  end

  create_table "team_admins", force: :cascade do |t|
    t.integer "team_id"
    t.integer "user_id"
    t.boolean "is_administrator"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["team_id"], name: "index_team_admins_on_team_id"
    t.index ["user_id"], name: "index_team_admins_on_user_id"
  end

  create_table "teams", force: :cascade do |t|
    t.string "name"
    t.string "creator"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_missions", force: :cascade do |t|
    t.integer "user_id"
    t.integer "team_id"
    t.integer "mission_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_open"
    t.index ["mission_id"], name: "index_user_missions_on_mission_id"
    t.index ["team_id"], name: "index_user_missions_on_team_id"
    t.index ["user_id"], name: "index_user_missions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.string "remember_digest"
    t.string "activation_digest"
    t.boolean "activated"
    t.datetime "activated_at"
    t.string "reset_digest"
    t.datetime "reset_sent_at"
    t.integer "team_id"
    t.string "photo"
    t.string "avatar"
    t.string "pinyin"
    t.integer "finish_by"
  end

end
