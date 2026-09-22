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
  const buckets = ['project-images', 'gallery-images']
  
  for (const bucket of buckets) {
    const { data: existingBucket } = await supabase.storage.getBucket(bucket)
    
    if (!existingBucket) {
      console.log(`Creating bucket: ${bucket}`)
      const { error } = await supabase.storage.createBucket(bucket, { public: true })
      if (error) {
        console.error(`Failed to create bucket ${bucket}:`, error)
      } else {
        console.log(`Bucket ${bucket} created successfully.`)
      }
    } else {
      console.log(`Bucket ${bucket} already exists.`)
    }
  }
}

async function uploadAndCleanupFolder(localDir, bucketName, tableName) {
  console.log(`\nProcessing ${localDir} -> ${bucketName}...`)
  
  if (!fs.existsSync(localDir)) {
    console.log(`Directory ${localDir} does not exist. Skipping.`)
    return
  }

  const files = fs.readdirSync(localDir)
  let successCount = 0

  for (const file of files) {
    const filePath = path.join(localDir, file)
    let stat;
    try {
      stat = fs.statSync(filePath)
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log(`File ${file} disappeared before processing. Skipping.`);
        continue;
      }
      console.error(`Error reading ${file}:`, err);
      continue;
    }
    
    if (stat.isFile()) {
      try {
        // 1. Upload to Supabase Storage
        const fileContent = fs.readFileSync(filePath)
        
        // Supabase requires clean ascii keys. We strip emojis and special chars.
        const ext = file.split('.').pop()
        const nameWithoutExt = file.substring(0, file.lastIndexOf('.')) || file
        const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9 -]/g, '').trim().replace(/\s+/g, '-') || 'image'
        const storagePath = `${cleanName}-${Date.now()}.${ext}`
        
        console.log(`Uploading ${file} as ${storagePath}...`)
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(storagePath, fileContent, { upsert: true })

        if (uploadError) throw uploadError

        console.log(`Updating database for ${file}...`)
        
        // Find all records that contain this original filename in their image_url
        const { data: records, error: fetchError } = await supabase
          .from(tableName)
          .select('id, image_url')
          .like('image_url', `%${file}%`)
          
        if (fetchError) throw fetchError
        
        if (records && records.length > 0) {
          for (const record of records) {
             const { error: updateError } = await supabase
              .from(tableName)
              .update({ image_url: storagePath })
              .eq('id', record.id)
              
             if (updateError) throw updateError
          }
        }

        // 3. Delete the local physical file
        try {
          fs.unlinkSync(filePath)
          successCount++
          console.log(`Successfully processed and deleted local file: ${file}`)
        } catch (err) {
           if (err.code === 'ENOENT') {
             console.log(`File ${file} was already deleted.`);
           } else {
             throw err;
           }
        }

      } catch (err) {
        console.error(`Error processing ${file}:`, err)
      }
    }
  }
  
  console.log(`Completed processing ${successCount} files in ${localDir}`)
}

async function main() {
  console.log("Starting Image Migration & Cleanup...")
  
  await createBuckets()
  
  const projectDir = path.resolve(__dirname, '../public/Pic/Project')
  const galleryDir = path.resolve(__dirname, '../public/Pic/Gallery')
  
  await uploadAndCleanupFolder(projectDir, 'project-images', 'projects')
  await uploadAndCleanupFolder(galleryDir, 'gallery-images', 'gallery')
  
  console.log("\nMigration & Cleanup Complete!")
  console.log("Note: Any empty directories in public/Pic can now be safely deleted.")
}

main()
