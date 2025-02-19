// models/PermissionModel.js
import mongoose from "mongoose";

const permissionSettingsSchema = new mongoose.Schema(
  {
    read: {
      type: Boolean,
      default: false,
    },
    write: {
      type: Boolean,
      default: false,
    },
    update: {
      type: Boolean,
      default: false,
    },
    delete: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const modulePermissionsSchema = new mongoose.Schema(
  {
    invoices: permissionSettingsSchema,
    employees: permissionSettingsSchema,
    products: permissionSettingsSchema,
  },
  { _id: false }
);

const permissionSchema = new mongoose.Schema(
  {
    roleId: {
      type: String,
      required: true,
      ref: "Role",
    },
    roleName: {
      type: String,
      required: true,
    },
    module: {
      type: modulePermissionsSchema,
      required: true,
      validate: {
        validator: function (obj) {
          return obj && Object.keys(obj).length > 0;
        },
        message: "At least one module must be defined",
      },
    },
  },
  {
    timestamps: true,
  }
);

permissionSchema.index({ roleId: 1 }, { unique: true });

const Permission = mongoose.model("Permission", permissionSchema);
export default Permission;
