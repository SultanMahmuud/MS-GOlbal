import AuthComponent from "@/components/Authcomponent/Authcomponent";

const AdminLoginPage = () => {
  return <AuthComponent allowedRole="admin" title="Admin Login" />;
};

export default AdminLoginPage;
