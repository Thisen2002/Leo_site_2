import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  console.log("Updating projects with status '26/27 Term' to 'Ongoing'...")
  
  const { data, error } = await supabase
    .from('projects')
    .update({ status: 'Ongoing' })
    .eq('status', '26/27 Term')
    .select()
    
  if (error) {
    console.error("Error updating:", error)
  } else {
    console.log("Updated projects:", data)
  }
}

run()
