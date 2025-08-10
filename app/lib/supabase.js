import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'

const supabaseUrl = 'https://hqdohwmjiincizduewqp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZG9od21qaWluY2l6ZHVld3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDkzMzcsImV4cCI6MjA3MDA4NTMzN30.xLPvok5h0CwjnHG3RXLoJ65Fq236QLCqtr1x0QbficQ'
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eW5qcHZ5eXprZXVvcGpoZ2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNTE4ODIsImV4cCI6MjA2ODkyNzg4Mn0.4S77auyvtbjdXTvNP9bZpU5KU_FD7k_pO_lHhP1YZ3Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
})

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})