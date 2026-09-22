import { createClient } from '@supabase/supabase-js'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_URL in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function insertInitialBlog() {
  const blogData = {
    title: "Before We Led, We Learned Together",
    author: "Leo Club Admin",
    excerpt: "Read about our latest activities and thoughts.",
    external_link: "https://blog01-leosofuop.blogspot.com/2026/08/before-we-led-we-learned-together-o-n.html",
    // Generic high-quality placeholder image
    image_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000"
  }

  const { data, error } = await supabase
    .from('blogs')
    .insert([blogData])
    .select()

  if (error) {
    console.error("Failed to insert blog:", error)
  } else {
    console.log("Successfully inserted the initial blog post!", data)
  }
}

insertInitialBlog()
