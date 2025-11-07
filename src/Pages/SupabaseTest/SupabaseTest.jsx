import React, { useState, useEffect } from 'react';
import { testSupabaseConnection, displaySupabaseInfo } from '../../utils/testSupabaseConnection';
import { supabase } from '../../config/supabaseClient';

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [configInfo, setConfigInfo] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Test connection on component mount
    const runTests = async () => {
      // Display config info
      const hasConfig = displaySupabaseInfo();
      setConfigInfo(hasConfig);

      // Test connection
      const isConnected = await testSupabaseConnection();
      setConnectionStatus(isConnected ? 'connected' : 'failed');

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-Garamond font-bold text-[#006938] mb-6">
            Supabase Connection Test
          </h1>

          {/* Connection Status */}
          <div className="mb-8">
            <h2 className="text-2xl font-Garamond font-semibold mb-4">
              Connection Status
            </h2>
            <div className="flex items-center gap-3">
              {connectionStatus === 'testing' && (
                <>
                  <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-lg">Testing connection...</span>
                </>
              )}
              {connectionStatus === 'connected' && (
                <>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-lg text-green-700 font-semibold">
                    ✅ Connected Successfully!
                  </span>
                </>
              )}
              {connectionStatus === 'failed' && (
                <>
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-lg text-red-700 font-semibold">
                    ❌ Connection Failed
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Configuration Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-Garamond font-semibold mb-4">
              Configuration
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Supabase URL:</span>
                <span className="text-sm font-mono bg-white px-2 py-1 rounded">
                  {import.meta.env.VITE_SUPABASE_URL || '❌ Not configured'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">API Key:</span>
                <span className="text-sm">
                  {import.meta.env.VITE_SUPABASE_ANON_KEY
                    ? '✅ Configured'
                    : '❌ Not configured'}
                </span>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-Garamond font-semibold mb-4">
              Authentication Status
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              {session ? (
                <div className="space-y-2">
                  <p className="text-green-700 font-semibold">
                    ✅ User is authenticated
                  </p>
                  <div className="text-sm">
                    <p>
                      <span className="font-semibold">Email:</span>{' '}
                      {session.user.email}
                    </p>
                    <p>
                      <span className="font-semibold">User ID:</span>{' '}
                      {session.user.id}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No active session (not logged in)</p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">
              Next Steps:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
              <li>Create tables in your Supabase dashboard</li>
              <li>Set up Row Level Security (RLS) policies</li>
              <li>Integrate authentication in your login/signup pages</li>
              <li>Start building your database queries</li>
            </ul>
          </div>

          {/* Console Message */}
          <div className="mt-6 text-sm text-gray-600">
            <p>
              💡 Check the browser console (F12) for detailed connection test
              results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseTest;

