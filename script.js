import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ✅ Your Supabase credentials
const supabaseUrl = 'https://suydwknvkemjimblgnrr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1eWR3a252a2VtamltYmxnbnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0OTI5NjYsImV4cCI6MjA2MTA2ODk2Nn0.demaRODnwcJRBLkIJC2vJ-zhAxLII32IjfGyl2A2eFc'

const supabase = createClient(supabaseUrl, supabaseKey)

const form = document.getElementById('upload-form')
const imageInput = document.getElementById('image-input')
const gallery = document.getElementById('gallery')

// Upload and save image
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const file = imageInput.files[0]
  if (!file) return alert('No file selected')

  const filePath = `${Date.now()}_${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Upload failed:', uploadError.message)
    return alert('Upload failed!')
  }

  const { data: publicData } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)

  const imageUrl = publicData.publicUrl

  // Save image URL to the database
  const { error: insertError } = await supabase
    .from('images')
    .insert([{ url: imageUrl }])

  if (insertError) {
    console.error('DB insert error:', insertError.message)
    return alert('Failed to save image info to database.')
  }

  imageInput.value = ''
  loadImages()
})

// Load all images from DB
async function loadImages() {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch failed:', error)
    return
  }

  gallery.innerHTML = ''
  data.forEach(({ url }) => {
    const img = document.createElement('img')
    img.src = url
    gallery.appendChild(img)
  })
}

// Load on startup
loadImages()
