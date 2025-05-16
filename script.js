// Load saved posts when the page loads
window.onload = function () {
  const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
  savedPosts.forEach(post => addPostToGallery(post.image, post.caption));
};

// Handle publish
function publishImage() {
  const imageInput = document.getElementById('imageInput');
  const captionInput = document.getElementById('captionInput');
  const file = imageInput.files[0];
  const caption = captionInput.value;

  if (!file) {
    alert("Please select an image to publish!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageUrl = e.target.result;

    // Add post to gallery
    addPostToGallery(imageUrl, caption);

    // Save post to localStorage
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    savedPosts.unshift({ image: imageUrl, caption: caption });
    localStorage.setItem("posts", JSON.stringify(savedPosts));
  };

  reader.readAsDataURL(file);

  // Clear inputs
  imageInput.value = '';
  captionInput.value = '';
}

// Add post to DOM
function addPostToGallery(imageUrl, caption) {
  const gallery = document.getElementById('gallery');

  const post = document.createElement('div');
  post.classList.add('image-post');

  const img = document.createElement('img');
  img.src = imageUrl;

  const captionElement = document.createElement('p');
  captionElement.textContent = caption || "No caption";

  post.appendChild(img);
  post.appendChild(captionElement);
  gallery.prepend(post); // Newest first
}
