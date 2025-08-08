import React from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminTourism from "./AdminTourism";

const AdminTourismPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      <AdminTourism />
    </div>
  );
};

export default AdminTourismPage;
