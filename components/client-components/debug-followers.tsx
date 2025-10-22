"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DebugFollowers() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const testQueries = async () => {
    setLoading(true);
    const testResults: any = {};

    try {
      // Test 1: Check if follows table exists and what columns it has
      console.log("Testing follows table...");
      const { data: followsTest, error: followsError } = await supabase
        .from("follows")
        .select("*")
        .limit(1);
      
      testResults.followsTable = {
        data: followsTest,
        error: followsError,
        columns: followsTest?.[0] ? Object.keys(followsTest[0]) : "No data"
      };

      // Test 2: Check profiles table
      console.log("Testing profiles table...");
      const { data: profilesTest, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .limit(1);
      
      testResults.profilesTable = {
        data: profilesTest,
        error: profilesError,
        columns: profilesTest?.[0] ? Object.keys(profilesTest[0]) : "No data"
      };

      // Test 3: Get current user
      console.log("Testing auth user...");
      const { data: authData, error: authError } = await supabase.auth.getUser();
      testResults.authUser = {
        data: authData,
        error: authError
      };

      console.log("All test results:", testResults);
      setResults(testResults);
    } catch (err) {
      console.error("Debug error:", err);
      testResults.error = err;
      setResults(testResults);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded">
      <h3 className="text-lg font-bold mb-4">Database Debug Tool</h3>
      <button 
        onClick={testQueries}
        disabled={loading}
        className="bg-blue-600 px-4 py-2 rounded mb-4"
      >
        {loading ? "Testing..." : "Run Database Tests"}
      </button>
      
      {results && (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold">Follows Table:</h4>
            <pre className="text-xs bg-black p-2 rounded overflow-auto">
              {JSON.stringify(results.followsTable, null, 2)}
            </pre>
          </div>
          
          <div>
            <h4 className="font-bold">Profiles Table:</h4>
            <pre className="text-xs bg-black p-2 rounded overflow-auto">
              {JSON.stringify(results.profilesTable, null, 2)}
            </pre>
          </div>
          
          <div>
            <h4 className="font-bold">Auth User:</h4>
            <pre className="text-xs bg-black p-2 rounded overflow-auto">
              {JSON.stringify(results.authUser, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}