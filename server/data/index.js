import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

export const roles = [
  {
    "_id": ObjectId("609306f34dbbfb8ec27e52c1"),
    "name": "admin",
    "permissions": [
      "users:read",
      "users:write",
      "users:edit",
      "users:delete",
      "joborders:read",
      "joborders:write",
      "joborders:edit",
      "joborders:delete",
      "roles:read",
      "roles:write",
      "roles:edit",
      "roles:delete",
      "permissions:read",
      "permissions:write",
      "permissions:edit",
      "permissions:delete",
    ]
  },
  {
    "_id": ObjectId("609307244dbbfb8ec27e52c2"),
    "name": "editor",
    "permissions": [
      "users:read",
      "joborders:read",
    ]
  },
  {
    "_id": ObjectId("609307384dbbfb8ec27e52c3"),
    "name": "viewer",
    "permissions": [
      "users:read",
      "joborders:read",
    ]
  }
];

export const permissions = [
  {
    "_id": ObjectId("609307574dbbfb8ec27e52c4"),
    "name": "users:read",
    "description": "Read users"
  },
  {
    "_id": ObjectId("609307714dbbfb8ec27e52c5"),
    "name": "users:write",
    "description": "Create Users"
  },
  {
    "_id": ObjectId("609307834dbbfb8ec27e52c6"),
    "name": "users:edit",
    "description": "Edit Users"
  },
  {
    "_id": ObjectId("6093078e4dbbfb8ec27e52c7"),
    "name": "users:delete",
    "description": "Delete Users"
  },
  {
    "_id": ObjectId("609307574dbbfb8ec27e52c8"),
    "name": "jobsorders:read",
    "description": "Read Job Orders"
  },
  {
    "_id": ObjectId("609307714dbbfb8ec27e52c9"),
    "name": "jobsorders:write",
    "description": "Create Job Orders"
  },
  {
    "_id": ObjectId("609307834dbbfb8ec27e52c1"),
    "name": "jobsorders:edit",
    "description": "Edit Job Orders"
  },
  {
    "_id": ObjectId("6093078e4dbbfb8ec27e52c2"),
    "name": "jobsorders:delete",
    "description": "Delete Job Orders"
  },
  {
    "_id": ObjectId("603307574dbbfb8ec27e52c8"),
    "name": "roles:read",
    "description": "Read Roles"
  },
  {
    "_id": ObjectId("603307714dbbfb8ec27e52c9"),
    "name": "roles:write",
    "description": "Create Roles"
  },
  {
    "_id": ObjectId("603307834dbbfb8ec27e52c1"),
    "name": "roles:edit",
    "description": "Edit Roles"
  },
  {
    "_id": ObjectId("6033078e4dbbfb8ec27e52c2"),
    "name": "roles:delete",
    "description": "Delete Roles"
  }, 
  {
    "_id": ObjectId("603307574dbbfb8ec27e52c8"),
    "name": "permissions:read",
    "description": "Read Permissions"
  },
  {
    "_id": ObjectId("603307714dbbfb8ec27e52c9"),
    "name": "permissions:write",
    "description": "Create Permissions"
  },
  {
    "_id": ObjectId("603307834dbbfb8ec27e52c1"),
    "name": "permissions:edit",
    "description": "Edit Permissions"
  },
  {
    "_id": ObjectId("6033078e4dbbfb8ec27e52c2"),
    "name": "permissions:delete",
    "description": "Delete Permissions"
  },
];
