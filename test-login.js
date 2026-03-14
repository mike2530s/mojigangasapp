const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nktouapjberliqbsyiqf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rdG91YXBqYmVybGlxYnN5aXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MDA0NDEsImV4cCI6MjA4NzQ3NjQ0MX0.v5A1E91qiz_fMWRgORareLmoAltysTiXSgodkuAIqCA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  const email = 'diazriveram05@gmail.com';
  const password = 'Migu3l0c02026'; // From user message
  
  console.log(`Attempting login for: ${email}`);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('Login Error:', error.message);
    console.error('Error Status:', error.status);
    console.error('Full Error:', error);
  } else {
    console.log('Login Success!');
    console.log('User Role:', data.user.role);
    console.log('App Metadata:', data.user.app_metadata);
  }
}

testLogin();
