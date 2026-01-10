'use client';

import { Form, Button, Typography } from 'antd';
import { FormInput, FormPassword } from '@/components/ui/inputs';
// import { Mail, Lock, Github, Chrome } from 'lucide-react';
import { useLogin } from '@/hooks/useAuth';

const { Title, Text } = Typography;

const LoginPage = () => {
  const login = useLogin();

  function onSubmit({ username, password }) {
    const payload = { username, password };
    login.mutate(payload);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-white p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="border-smoke rounded-2xl border bg-white p-8 shadow-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <Title level={2} className="m-0!">
              GardenHub
            </Title>
            <Text type="secondary">Sign in to your account to continue</Text>
          </div>

          {/* Login Form */}
          <Form layout="vertical" onFinish={onSubmit}>
            <FormInput
              name="username"
              label="Username"
              placeholder="Enter your email"
              //   prefix={<Mail size={18} className="text-gray-400" />}
              rules={[{ required: true, message: 'Please enter your email!' }]}
              className="mb-4"
            />

            <FormPassword
              name="password"
              label="Password"
              placeholder="Enter your password"
              //   prefix={<Lock size={18} className="text-gray-400" />}
              rules={[
                { required: true, message: 'Please enter your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
              className="mb-4"
            />

            {/* Submit Button */}
            <Button
              type="primary"
              size="large"
              loading={login.isPending}
              disabled={login.isPending}
              htmlType="submit"
              className="h-12 w-full border-0 bg-linear-to-r from-blue-500 to-purple-600 text-base font-medium hover:from-blue-600 hover:to-purple-700"
            >
              {login.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Text type="secondary" className="text-sm">
            © 2026 GardenHub. All rights reserved.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
