import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ajaia Docs</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-gray-500 mt-6">
          Demo accounts: alice@ajaia.dev / bob@ajaia.dev / carol@ajaia.dev
          <br />
          Password: <code className="bg-gray-100 px-1 rounded">password123</code>
        </p>
      </div>
    </div>
  );
}
