import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  permissions: {
    type: [String],
    required: true,
    enum: ['users:read', 'users:write', 'users:edit', 'users:delete',
     'joborders:read', 'joborders:write','joborders:edit','joborders:delete',
     'roles:read', 'roles:write','roles:edit','roles:delete',
     'permissions:read', 'permissions:write','permissions:edit','permissions:delete']
  }
});

const Role = mongoose.model('Role', roleSchema);

export default Role;