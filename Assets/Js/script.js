function scrollToSection() {
    // Get the target section you want to scroll to
    const section = document.getElementById('section');
    
    // Scroll to the target section smoothly
    section.scrollIntoView({
      behavior: 'smooth'
    });
}