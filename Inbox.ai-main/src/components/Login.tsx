'use client';


import { FcGoogle } from 'react-icons/fc';

export default function Login() {
    
  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Welcome Back</h2>
        <a href="/api/gmail/connect">
        <button
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-base font-medium hover:bg-gray-100 transition cursor-pointer"
        >
          <FcGoogle className="w-5 h-5" />
          Connect your Gmail
        </button>
        </a>
      </div>
    </div>
    </>
  );
}
