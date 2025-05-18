import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ✅ Replace with your Supabase project info
const supabaseUrl = 'https://suydwknvkemjimblgnrr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1eWR3a252a2VtamltYmxnbnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0OTI5NjYsImV4cCI6MjA2MTA2ODk2Nn0.demaRODnwcJRBLkIJC2vJ-zhAxLII32IjfGyl2A2eFc'
const supabase = createClient(supabaseUrl, supabaseKey)

const form = document.getElementById('upload-form')
const imageInput = document.getElementById('image-input')
const gallery = document.getElementById('gallery')

// ✅ Upload image
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const file = imageInput.files[0]
  if (!file) return

  const filePath = `${Date.now()}_${file.name}`

  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file)

  if (error) {
    alert('Upload failed: ' + error.message)
    return
  }

  const { data: publicUrlData } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)

  const imageUrl = publicUrlData.publicUrl

  // ✅ Insert URL into DB
  await supabase.from('images').insert([{ url: imageUrl }])
  loadImages()
})

// ✅ Load and show images
async function loadImages() {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return
  }

  gallery.innerHTML = ''
  data.forEach(({ url }) => {
    const img = document.createElement('img')
    img.src = url
    gallery.appendChild(img)
  })
}

// Load on page load
loadImages()
