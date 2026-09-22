import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
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

async function createBucket() {
  console.log("Checking and creating bucket...")
  const bucketName = 'research-files'
  
  const { data: existingBucket } = await supabase.storage.getBucket(bucketName)
  if (!existingBucket) {
    console.log(`Creating bucket: ${bucketName}`)
    const { error } = await supabase.storage.createBucket(bucketName, { public: true })
    if (error) console.error(`Failed to create bucket ${bucketName}:`, error)
    else console.log(`Bucket ${bucketName} created successfully.`)
  } else {
    console.log(`Bucket ${bucketName} already exists.`)
  }
}

async function uploadFile(absolutePath, bucketName) {
  if (!fs.existsSync(absolutePath)) {
    console.warn(`Local file not found: ${absolutePath}`);
    return null;
  }
  
  const file = path.basename(absolutePath);
  const fileContent = fs.readFileSync(absolutePath);
  
  const ext = file.split('.').pop()
  const nameWithoutExt = file.substring(0, file.lastIndexOf('.')) || file
  const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9 -]/g, '').trim().replace(/\s+/g, '-') || 'file'
  const storagePath = `${cleanName}-${Date.now()}.${ext}`

  console.log(`Uploading ${file} as ${storagePath} to ${bucketName}...`)
  
  // Note: we can pass contentType to ensure it's served as a PDF
  const { error } = await supabase.storage
    .from(bucketName)
    .upload(storagePath, fileContent, { 
        upsert: true,
        contentType: 'application/pdf'
    })

  if (error) {
    console.error(`Error uploading ${file}:`, error);
    return null;
  }
  
  // Safe delete
  try {
      fs.unlinkSync(absolutePath);
  } catch (e) {
      console.error(`Failed to delete local file ${absolutePath}:`, e.message);
  }
  
  return { storagePath, nameWithoutExt, originalName: file };
}

async function migrateResearch() {
  console.log("\nMigrating Research PDFs...")
  const researchDir = path.resolve(__dirname, '../public/Research');
  
  if (!fs.existsSync(researchDir)) {
    console.log("public/Research directory not found.");
    return;
  }
  
  const files = fs.readdirSync(researchDir);
  
  for (const file of files) {
    if (!file.toLowerCase().endsWith('.pdf')) continue;
    
    console.log(`Processing ${file}...`)
    const absolutePath = path.join(researchDir, file);
    
    const uploadResult = await uploadFile(absolutePath, 'research-files');
    
    if (uploadResult) {
      const dbRecord = {
        title: uploadResult.nameWithoutExt,
        file_name: uploadResult.originalName,
        file_url: uploadResult.storagePath
      };
      
      const { error } = await supabase.from('research_papers').insert([dbRecord]);
      if (error) {
        console.error(`Error inserting ${file} into database:`, error);
      }
    }
  }
  
  console.log("Deleted local PDF files.");
}

async function main() {
  console.log("Starting Research Migration...")
  await createBucket()
  await migrateResearch()
  console.log("\nResearch Migration Complete!")
}

main()
