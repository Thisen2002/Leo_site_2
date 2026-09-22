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

async function createBuckets() {
  console.log("Checking and creating buckets...")
  const buckets = ['exco-images', 'bod-images']
  
  for (const bucket of buckets) {
    const { data: existingBucket } = await supabase.storage.getBucket(bucket)
    if (!existingBucket) {
      console.log(`Creating bucket: ${bucket}`)
      const { error } = await supabase.storage.createBucket(bucket, { public: true })
      if (error) console.error(`Failed to create bucket ${bucket}:`, error)
      else console.log(`Bucket ${bucket} created successfully.`)
    } else {
      console.log(`Bucket ${bucket} already exists.`)
    }
  }
}

async function uploadImage(localImagePath, bucketName) {
  if (!localImagePath) return null;
  // Determine absolute path assuming it starts with /Pic/
  const absolutePath = path.resolve(__dirname, `../public${localImagePath}`);
  
  if (!fs.existsSync(absolutePath)) {
    console.warn(`Local image not found: ${absolutePath}`);
    return null; // Keep the original path if file doesn't exist, or maybe just null. Let's return original.
  }
  
  const file = path.basename(absolutePath);
  const fileContent = fs.readFileSync(absolutePath);
  
  const ext = file.split('.').pop()
  const nameWithoutExt = file.substring(0, file.lastIndexOf('.')) || file
  const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9 -]/g, '').trim().replace(/\s+/g, '-') || 'image'
  const storagePath = `${cleanName}-${Date.now()}.${ext}`

  console.log(`Uploading ${file} as ${storagePath} to ${bucketName}...`)
  const { error } = await supabase.storage
    .from(bucketName)
    .upload(storagePath, fileContent, { upsert: true })

  if (error) {
    console.error(`Error uploading ${file}:`, error);
    return null;
  }
  
  // Safe delete
  try {
      fs.unlinkSync(absolutePath);
  } catch (e) {
      console.error(`Failed to delete local image ${absolutePath}:`, e.message);
  }
  
  return storagePath;
}

async function migrateExecutiveBoard() {
  console.log("\nMigrating Executive Board...")
  const jsonPath = path.resolve(__dirname, '../src/json files/executiveBoard.json');
  if (!fs.existsSync(jsonPath)) {
    console.log("executiveBoard.json not found.");
    return;
  }
  
  let rawData = fs.readFileSync(jsonPath, 'utf8')
  if (rawData.charCodeAt(0) === 0xFEFF) rawData = rawData.slice(1);
  const data = JSON.parse(rawData)
  
  for (const member of data) {
    console.log(`Processing ${member.name}...`)
    let newImageUrl = null;
    if (member.image) {
      const uploadedPath = await uploadImage(member.image, 'exco-images');
      newImageUrl = uploadedPath || member.image; // fallback to old path if upload failed
    }
    
    const dbRecord = {
      name: member.name,
      position: member.position,
      bio: member.bio,
      email: member.email,
      linkedin: member.linkedin,
      image_url: newImageUrl
    };
    
    const { error } = await supabase.from('executive_board').insert([dbRecord]);
    if (error) {
      console.error(`Error inserting ${member.name}:`, error);
    }
  }
  
  // Delete the JSON file
  fs.unlinkSync(jsonPath);
  console.log("Deleted executiveBoard.json");
}

async function migrateAvenueDirectors() {
  console.log("\nMigrating Avenue Directors...")
  const jsonPath = path.resolve(__dirname, '../src/json files/avenuedirectors.json');
  if (!fs.existsSync(jsonPath)) {
    console.log("avenuedirectors.json not found.");
    return;
  }
  
  let rawData = fs.readFileSync(jsonPath, 'utf8')
  if (rawData.charCodeAt(0) === 0xFEFF) rawData = rawData.slice(1);
  const data = JSON.parse(rawData)
  
  for (const category of data) {
    const avenueName = category.avenue;
    for (const member of category.members) {
      console.log(`Processing ${member.name} (${avenueName})...`)
      let newImageUrl = null;
      if (member.image) {
        const uploadedPath = await uploadImage(member.image, 'bod-images');
        newImageUrl = uploadedPath || member.image;
      }
      
      const dbRecord = {
        avenue: avenueName,
        name: member.name,
        position: member.position,
        email: member.email,
        linkedin: member.linkedin,
        image_url: newImageUrl
      };
      
      const { error } = await supabase.from('avenue_directors').insert([dbRecord]);
      if (error) {
        console.error(`Error inserting ${member.name}:`, error);
      }
    }
  }
  
  // Delete the JSON file
  fs.unlinkSync(jsonPath);
  console.log("Deleted avenuedirectors.json");
}

async function main() {
  console.log("Starting Team Migration...")
  await createBuckets()
  await migrateExecutiveBoard()
  await migrateAvenueDirectors()
  console.log("\nTeam Migration Complete!")
}

main()
